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
  exitX: number
}

export function GreetingCard({ chinese, pinyin, english, emoji, isFlipped, onFlip, exitX }: GreetingProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="w-full h-[300px] sm:h-[400px] [perspective:1000px] relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={chinese}
          className="w-full h-full relative cursor-pointer [transform-style:preserve-3d]"
          onClick={onFlip}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          initial={{ x: 300, opacity: 0, rotate: 0 }}
          animate={{ 
            x: 0, 
            opacity: 1,
            rotateY: isFlipped ? 180 : 0,
            scale: isHovered ? 1.02 : 1,
            rotate: [0, -2, 2, -1, 1, 0],
          }}
          exit={{ 
            x: exitX,
            opacity: 0,
            transition: { duration: 0.2 }
          }}
          transition={{ 
            duration: 0.3,
            rotate: {
              duration: 0.5,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              ease: "easeInOut",
              delay: 0.1
            }
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Front stacked cards */}
          <motion.div 
            className="absolute w-full h-full bg-red-500/10 rounded-2xl -z-20 transform translate-x-6 translate-y-2 [backface-visibility:hidden]"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -1, 1, -0.5, 0.5, 0] }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute w-full h-full bg-red-500/20 rounded-2xl -z-10 transform translate-x-3 translate-y-1 [backface-visibility:hidden]"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -1.5, 1.5, -0.75, 0.75, 0] }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute w-full h-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.15)] overflow-hidden [backface-visibility:hidden] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] transition-shadow duration-300"
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

          {/* Back stacked cards */}
          <motion.div 
            className="absolute w-full h-full bg-yellow-300/10 rounded-2xl -z-20 transform translate-x-6 translate-y-2 rotateY-180 [backface-visibility:hidden]"
            style={{ transform: 'rotateY(180deg) translateX(24px) translateY(8px)' }}
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -1, 1, -0.5, 0.5, 0] }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute w-full h-full bg-yellow-300/20 rounded-2xl -z-10 transform translate-x-3 translate-y-1 rotateY-180 [backface-visibility:hidden]"
            style={{ transform: 'rotateY(180deg) translateX(12px) translateY(4px)' }}
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -1.5, 1.5, -0.75, 0.75, 0] }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute w-full h-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.15)] overflow-hidden [backface-visibility:hidden] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] transition-shadow duration-300"
            style={{ transform: 'rotateY(180deg)' }}
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
      </AnimatePresence>
    </div>
  )
}

