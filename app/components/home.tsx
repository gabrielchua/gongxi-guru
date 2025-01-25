"use client"

import { useState, useEffect } from "react"
import { GreetingCard } from "./greeting-card"
import { AITutor } from "./ai-tutor"
import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, Mic } from "lucide-react"
import { greetings, shuffleArray } from "@/data/greetings"

export function Home() {
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0)
  const [showAITutor, setShowAITutor] = useState(false)
  const [shuffledGreetings, setShuffledGreetings] = useState(greetings)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    setShuffledGreetings(shuffleArray(greetings))
  }, [])

  const nextGreeting = () => {
    setCurrentGreetingIndex((prevIndex) => (prevIndex + 1) % shuffledGreetings.length)
    setIsFlipped(false)
  }

  const previousGreeting = () => {
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
  }, [showAITutor])

  const toggleAITutor = () => {
    setShowAITutor(!showAITutor)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-red-500 to-yellow-500">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-8">🍊 新 年 快 乐 🧧</h1>
      <h2 className="text-lg sm:text-xl font-medium text-white/90 mb-4 sm:mb-8">Welcome to the CNY dojo</h2>
      {showAITutor ? (
        <AITutor onGreetingLearned={toggleAITutor} />
      ) : (
        <div className="w-full max-w-md">
          <div className="relative h-[300px] sm:h-[400px]">
            {/* Background stacked cards */}
            <div className="absolute inset-x-0 top-2 h-[300px] sm:h-[400px] bg-yellow-400/5 rounded-2xl transform translate-x-8" />
            <div className="absolute inset-x-0 top-1 h-[300px] sm:h-[400px] bg-yellow-400/10 rounded-2xl transform translate-x-4" />
            {/* Active card */}
            <motion.div
              key={currentGreetingIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative h-full"
            >
              <GreetingCard 
                {...shuffledGreetings[currentGreetingIndex]} 
                isFlipped={isFlipped}
                onFlip={toggleFlip}
              />
            </motion.div>
          </div>
          <div className="flex flex-col gap-4 mt-4 sm:mt-8">
            <div className="flex justify-between items-center gap-2 sm:gap-4">
              <button
                onClick={previousGreeting}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-400 text-red-700 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:bg-yellow-300 transition-colors duration-300 flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Prev
              </button>
              <button
                onClick={toggleAITutor}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-yellow-300 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:bg-red-500 transition-colors duration-300 flex items-center justify-center"
              >
                Practice <Mic className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={nextGreeting}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-400 text-red-700 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:bg-yellow-300 transition-colors duration-300 flex items-center justify-center"
              >
                Next <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
} 