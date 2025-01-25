"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCw, Sparkles } from "lucide-react"

interface GreetingProps {
  chinese: string
  pinyin: string
  english: string
  emoji: string
  isFlipped: boolean
  onFlip: () => void
}

export function GreetingCard({ chinese, pinyin, english, emoji, isFlipped, onFlip }: GreetingProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="perspective-1000 w-full h-full">
      <motion.div
        className="w-full h-full relative cursor-pointer"
        onClick={onFlip}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          scale: isHovered ? 1.02 : 1,
          transition: { duration: 0.6 },
        }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="w-full h-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.15)] overflow-hidden backface-hidden hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] transition-shadow duration-300"
          animate={{ opacity: isFlipped ? 0 : 1 }}
        >
          <div className="relative p-6 sm:p-8 flex flex-col justify-center h-full gap-4 sm:gap-6">
            <AnimatePresence>
              {isHovered && !isFlipped && (
                <motion.div 
                  className="absolute top-2 right-2 text-yellow-300/80"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.p 
              className="text-5xl sm:text-6xl font-bold text-yellow-300 mb-2 sm:mb-4 text-center tracking-wide"
              animate={{ y: isHovered ? -5 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {chinese}
            </motion.p>
            <motion.p 
              className="text-sm sm:text-base text-yellow-100/90 mb-2 sm:mb-4 text-center tracking-wider font-medium"
              animate={{ y: isHovered ? -3 : 0 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            >
              {pinyin}
            </motion.p>
            <motion.p 
              className="text-6xl sm:text-7xl text-center"
              animate={{ 
                y: isHovered ? -2 : 0,
                rotate: isHovered ? [0, -10, 10, -5, 5, 0] : 0 
              }}
              transition={{ 
                y: { type: "spring", stiffness: 300, delay: 0.2 },
                rotate: { duration: 0.5, delay: 0.2 }
              }}
            >
              {emoji}
            </motion.p>
          </div>
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center text-yellow-300/90 gap-2">
            <p className="text-xs hidden md:inline font-medium">SPACE</p>
            <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 animate-[spin_3s_linear_infinite]" />
            <span className="sr-only">Tap for English translation</span>
          </div>
        </motion.div>
        <motion.div
          className="w-full h-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.15)] overflow-hidden backface-hidden hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] transition-shadow duration-300 absolute top-0 left-0"
          style={{ rotateY: 180 }}
          animate={{ opacity: isFlipped ? 1 : 0 }}
        >
          <div className="relative p-6 sm:p-8 flex flex-col justify-center h-full gap-4 sm:gap-6">
            <AnimatePresence>
              {isHovered && isFlipped && (
                <motion.div 
                  className="absolute top-2 right-2 text-red-700/80"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.p 
              className="text-2xl sm:text-3xl font-bold text-red-700 mb-2 sm:mb-4 text-center tracking-wide"
              animate={{ y: isHovered ? -5 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {english}
            </motion.p>
            <motion.p 
              className="text-6xl sm:text-7xl text-center"
              animate={{ 
                y: isHovered ? -2 : 0,
                rotate: isHovered ? [0, -10, 10, -5, 5, 0] : 0 
              }}
              transition={{ 
                y: { type: "spring", stiffness: 300, delay: 0.2 },
                rotate: { duration: 0.5, delay: 0.2 }
              }}
            >
              {emoji}
            </motion.p>
          </div>
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center text-red-700/90 gap-2">
            <p className="text-xs hidden md:inline font-medium">SPACE</p>
            <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 animate-[spin_3s_linear_infinite]" />
            <span className="sr-only">Tap to return</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

