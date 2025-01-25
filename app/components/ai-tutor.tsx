"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { TUTOR_PROMPT } from "@/app/prompts/tutor-prompt"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, StopCircle, Gift, Sparkles } from "lucide-react"
import { retry } from "@/app/utils/retry"

const SESSION_TIME_LIMIT_SECONDS = 300 // 3 minutes

interface AITutorProps {
  onGreetingLearned: () => void
}

export function AITutor({ onGreetingLearned }: AITutorProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sessionActive, setSessionActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(SESSION_TIME_LIMIT_SECONDS)
  const [timeoutMessage, setTimeoutMessage] = useState("")
  const [showRedPacket, setShowRedPacket] = useState(false)
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const dataChannel = useRef<RTCDataChannel | null>(null)
  const audioElement = useRef<HTMLAudioElement | null>(null)
  const sessionTimer = useRef<NodeJS.Timeout | null>(null)
  const countdownTimer = useRef<NodeJS.Timeout | null>(null)
  const tokenRefreshTimer = useRef<NodeJS.Timeout | null>(null)
  const connectionAttempts = useRef(0)
  
  // Add monitoring state
  const [metrics, setMetrics] = useState({
    connectionAttempts: 0,
    tokenRefreshes: 0,
    errors: 0
  })

  useEffect(() => {
    return () => {
      cleanupWebRTC();
      if (sessionTimer.current) {
        clearTimeout(sessionTimer.current);
      }
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
      }
      if (tokenRefreshTimer.current) {
        clearInterval(tokenRefreshTimer.current)
      }
    }
  }, [])

  const cleanupWebRTC = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (dataChannel.current) {
      dataChannel.current.close();
      dataChannel.current = null;
    }
    if (audioElement.current) {
      audioElement.current.srcObject = null;
      audioElement.current = null;
    }
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
    }
    if (sessionTimer.current) {
      clearTimeout(sessionTimer.current);
    }
    setIsConnected(false);
    setSessionActive(false);
    setIsSpeaking(false);
    setTimeLeft(SESSION_TIME_LIMIT_SECONDS);
    if (sessionActive) {
      setTimeoutMessage("Thank you for practicing! 新年快乐! 🎊");
    }
    
    if (tokenRefreshTimer.current) {
      clearInterval(tokenRefreshTimer.current)
      tokenRefreshTimer.current = null
    }
    
    connectionAttempts.current = 0
  }

  const refreshToken = async () => {
    try {
      const response = await fetch("/api/get-ephemeral-token")
      const data = await response.json()
      
      if (data.error || !data.client_secret?.value) {
        throw new Error(data.error || "Invalid token response")
      }
      
      setMetrics(prev => ({
        ...prev,
        tokenRefreshes: prev.tokenRefreshes + 1
      }))
      
      return data.client_secret.value
    } catch (error) {
      console.error("Token refresh failed:", error)
      setMetrics(prev => ({
        ...prev,
        errors: prev.errors + 1
      }))
      throw error
    }
  }

  /**
   * Initialize the WebRTC connection and set up the data channel/audio.
   * Then, set up the session instructions (system prompt) once the data channel is open.
   */
  async function initWebRTC() {
    try {
      setTimeoutMessage("")
      setError(null)
      
      setMetrics(prev => ({
        ...prev,
        connectionAttempts: prev.connectionAttempts + 1
      }))

      // Get initial token with retry
      const EPHEMERAL_KEY = await retry(refreshToken, {
        maxAttempts: 3,
        delayMs: 1000
      })

      // Initialize WebRTC
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      })
      peerConnection.current = pc

      // Set up audio element
      audioElement.current = new Audio()
      audioElement.current.autoplay = true

      // Handle incoming audio stream
      pc.ontrack = (event) => {
        if (audioElement.current && event.streams[0]) {
          audioElement.current.srcObject = event.streams[0]
        }
      }

      // Add local audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => pc.addTrack(track, stream))

      // Create data channel for events
      dataChannel.current = pc.createDataChannel('oai-events')
      dataChannel.current.onmessage = handleServerMessage
      dataChannel.current.onopen = () => {
        console.log("Data channel is open. Setting system instructions (session prompt).");

        // Once the channel is open, set the "system prompt" at the session level:
        setSessionInstructions();
        
        // Optionally, we can start the conversation right away:
        startConversation();
      }

      // Create and set local description
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      })
      await pc.setLocalDescription(offer)

      // Get answer from OpenAI
      const baseUrl = "https://api.openai.com/v1/realtime"
      const model = "gpt-4o-realtime-preview-2024-12-17"
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp
      })

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text()
        throw new Error(`OpenAI SDP error: ${sdpResponse.status} - ${errorText}`)
      }

      // Set remote description
      const answerSdp = await sdpResponse.text()
      await pc.setRemoteDescription({
        type: 'answer',
        sdp: answerSdp
      })

      setIsConnected(true)
      setSessionActive(true)

      // Start countdown timer
      countdownTimer.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            cleanupWebRTC();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Set 2-minute timer
      sessionTimer.current = setTimeout(() => {
        cleanupWebRTC();
      }, SESSION_TIME_LIMIT_SECONDS * 1000);

      // Set up token refresh every 4 minutes (assuming 5-minute token lifetime)
      tokenRefreshTimer.current = setInterval(async () => {
        try {
          const newToken = await refreshToken()
          // Implement token update logic here - might require reconnection
          console.log("Token refreshed successfully")
        } catch (error) {
          console.error("Token refresh failed:", error)
          cleanupWebRTC()
          setError("Session expired. Please start a new session.")
        }
      }, 4 * 60 * 1000)

      // Add connection monitoring
      pc.oniceconnectionstatechange = () => {
        console.log("ICE Connection State:", pc.iceConnectionState)
        if (pc.iceConnectionState === "failed") {
          setMetrics(prev => ({
            ...prev,
            errors: prev.errors + 1
          }))
          handleConnectionFailure()
        }
      }

    } catch (err: any) {
      console.error("WebRTC initialization failed:", err)
      setMetrics(prev => ({
        ...prev,
        errors: prev.errors + 1
      }))
      setError(err.message || "Failed to initialize WebRTC")
      setSessionActive(false)
      setIsConnected(false)
    }
  }

  /**
   * Send a session.update event to set your "system prompt" as session instructions.
   * This ensures the model sees it as top-level context for all responses.
   */
  function setSessionInstructions() {
    if (dataChannel.current?.readyState === "open") {
      const systemEvent = {
        type: "session.update",
        session: {
          instructions: TUTOR_PROMPT
        }
      };
      dataChannel.current.send(JSON.stringify(systemEvent));
    }
  }

  /**
   * Once the session instructions are set, we can send a new request to the model
   * to begin a lesson, greet the user, etc.
   */
  function startConversation() {
    if (dataChannel.current?.readyState === "open") {
      const event = {
        type: "response.create",
        response: {
          // Because we've set instructions at the session level,
          // we can keep these ephemeral instructions minimal or empty
          modalities: ["text", "audio"],
          instructions: TUTOR_PROMPT,
          voice: "sage",
        },
      }
      dataChannel.current.send(JSON.stringify(event))
    }
  }

  function handleServerMessage(event: MessageEvent) {
    const data = JSON.parse(event.data)
    console.log("Received server message:", data)

    if (data.type === "text.delta") {
      setTranscript((prev) => prev + data.delta)
      // Show red packet animation when praise is detected
      if (data.delta.includes("红包") || data.delta.includes("angbao") || data.delta.toLowerCase().includes("good")) {
        setShowRedPacket(true)
        setTimeout(() => setShowRedPacket(false), 3000)
      }
    } else if (data.type === "audio.start") {
      setIsSpeaking(true)
    } else if (data.type === "audio.end") {
      setIsSpeaking(false)
    }
  }

  function handleMicClick() {
    // If not active, initialize WebRTC and let the data channel onopen() do the rest
    if (!sessionActive) {
      initWebRTC();
    } 
    // If already active, you can optionally start sending an audio.start event, 
    // though with VAD on, you don't strictly need it. 
    else if (dataChannel.current?.readyState === "open") {
      const event = {
        type: "audio.start",
        audio: {
          encoding: "webm",
          sampleRate: 48000,
          channels: 1,
        },
      }
      dataChannel.current.send(JSON.stringify(event))
    }
  }

  function handleStopClick() {
    if (dataChannel.current?.readyState === "open") {
      const event = {
        type: "audio.end",
      }
      dataChannel.current.send(JSON.stringify(event))
    }
    cleanupWebRTC();
  }

  const handleConnectionFailure = async () => {
    if (connectionAttempts.current >= 3) {
      cleanupWebRTC()
      console.error("Connection failed after multiple attempts")
      setError("Connection failed after multiple attempts")
      return
    }

    connectionAttempts.current++
    console.log(`Attempting reconnection (${connectionAttempts.current}/3)...`)
    
    try {
      await initWebRTC()
    } catch (error) {
      console.error("Reconnection failed:", error)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div 
        className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-red-600/10 backdrop-blur-sm" />
        <div className="relative p-8">
          <AnimatePresence>
            {sessionActive && timeLeft > 0 && (
              <motion.div 
                className="text-center mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/90 rounded-full text-red-700 font-semibold">
                  <span className="text-lg">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {timeoutMessage && !sessionActive && (
              <motion.div 
                className="bg-yellow-100 text-yellow-800 px-6 py-4 rounded-lg relative mb-6 text-center font-medium"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {timeoutMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-4">
            <div className="flex justify-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleMicClick}
                  disabled={isSpeaking || (isConnected && !sessionActive)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-red-700 px-6 py-3 rounded-full flex items-center gap-3 disabled:bg-yellow-300 font-semibold text-lg shadow-lg disabled:cursor-not-allowed transition-all duration-300"
                >
                  {sessionActive ? (
                    <>
                      Speaking
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-red-700 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 bg-red-700 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 bg-red-700 rounded-full animate-bounce" />
                      </div>
                    </>
                  ) : (
                    <>
                      Start Session <Mic className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleStopClick}
                  disabled={!sessionActive}
                  className="bg-white hover:bg-red-100 text-red-600 px-6 py-3 rounded-full flex items-center gap-3 disabled:bg-gray-200 disabled:text-gray-400 font-semibold text-lg shadow-lg disabled:cursor-not-allowed transition-all duration-300 border-2 border-red-600"
                >
                  End <StopCircle className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={onGreetingLearned} 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-red-700 px-6 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 mt-4"
              >
                Back to Flashcards
              </Button>
            </motion.div>
          </div>

          {transcript && (
            <motion.div 
              className="mt-6 p-4 bg-white/90 rounded-lg shadow-inner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-gray-800 text-lg">{transcript}</p>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {showRedPacket && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="relative">
                <Gift className="w-24 h-24 text-yellow-400 animate-bounce" />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
