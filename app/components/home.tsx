"use client"

import { useState, useEffect } from "react"
import { GreetingCard } from "./greeting-card"
import { AITutor } from "./ai-tutor"
import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, Mic } from "lucide-react"
import { greetings, shuffleArray } from "@/data/greetings"
import { Button } from "@/components/ui/button"
import { PermissionDialog } from "./permission-dialog"

interface GreetingProps {
  chinese: string
  pinyin: string
  english: string
  emoji: string
  isFlipped: boolean
  onFlip: () => void
  exitX: number
}

export function Home() {
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0)
  const [showAITutor, setShowAITutor] = useState(false)
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  const [shuffledGreetings, setShuffledGreetings] = useState(greetings)
  const [isFlipped, setIsFlipped] = useState(false)
  const [exitX, setExitX] = useState(0)

  useEffect(() => {
    setShuffledGreetings(shuffleArray(greetings))
  }, [])

  const nextGreeting = () => {
    setExitX(-300) // Swipe left
    setCurrentGreetingIndex((prevIndex) => (prevIndex + 1) % shuffledGreetings.length)
    setIsFlipped(false)
  }

  const previousGreeting = () => {
    setExitX(300) // Swipe right
    setCurrentGreetingIndex((prevIndex) => 
      prevIndex === 0 ? shuffledGreetings.length - 1 : prevIndex - 1
    )
    setIsFlipped(false)
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showAITutor) return
      
      switch (e.key) {
        case 'ArrowRight':
          nextGreeting()
          break
        case 'ArrowLeft':
          previousGreeting()
          break
        case ' ': // Space bar
          e.preventDefault() // Prevent page scrolling
          toggleFlip()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showAITutor, nextGreeting, previousGreeting, toggleFlip])

  const handlePracticeClick = async () => {
    try {
      // Try to get microphone access immediately
      await navigator.mediaDevices.getUserMedia({ audio: true })
      // If successful, go straight to AI Tutor
      setShowAITutor(true)
    } catch (error) {
      // If failed, show the permission dialog
      setShowPermissionDialog(true)
    }
  }

  const handlePermissionContinue = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true })
      // If successful, close dialog and show AI Tutor
      setShowPermissionDialog(false)
      setShowAITutor(true)
    } catch (error) {
      // If permission denied or error, keep dialog open
      console.error('Microphone access denied:', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-full gap-4 pt-2 md:pt-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-yellow-100">🍊 新 年 快 乐 🧧</h1>
      <h2 className="text-lg sm:text-xl font-medium text-yellow-100/90 mb-4">Welcome to the CNY dojo</h2>
      {showAITutor ? (
        <>
          <AITutor onGreetingLearned={() => setShowAITutor(false)} />
          <div className="text-sm text-white text-center mt-4 mb-8 bg-black/10 p-4 rounded-lg">
            <p>Please allow microphone access when prompted</p>
            <p>Best experienced with headphones 🎧</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
            <GreetingCard
              {...shuffledGreetings[currentGreetingIndex]}
              isFlipped={isFlipped}
              onFlip={toggleFlip}
              exitX={exitX}
            />
            <div className="flex gap-6 items-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={previousGreeting}
                className="text-yellow-100 hover:text-yellow-200 hover:bg-yellow-100/20 transition-all duration-300 group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={nextGreeting}
                className="text-yellow-100 hover:text-yellow-200 hover:bg-yellow-100/20 transition-all duration-300 group"
              >
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
            <Button
              onClick={handlePracticeClick}
              className="bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 text-red-600 hover:text-red-700 hover:opacity-90 transition-all duration-300 px-8 py-4 text-lg font-bold group hover:animate-[wiggle-energetic_0.5s_ease-in-out_infinite] rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]"
            >
              <Mic className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Practice
            </Button>
          </div>
        </>
      )}

      <PermissionDialog 
        isOpen={showPermissionDialog}
        onClose={() => setShowPermissionDialog(false)}
        onContinue={handlePermissionContinue}
      />
    </div>
  )
} 