"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mic, Headphones, AlertCircle } from "lucide-react"

interface PermissionDialogProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => Promise<void>
}

export function PermissionDialog({ isOpen, onClose, onContinue }: PermissionDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleContinue = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await onContinue()
    } catch (err) {
      setError('Unable to access microphone. Please check your browser settings and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-yellow-100 border-yellow-100/20 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Mic className="h-6 w-6" />
            Microphone Access Required
          </DialogTitle>
          <DialogDescription className="text-yellow-100/90">
            To practice your pronunciation with the AI Tutor, we need access to your microphone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-100/20 p-2 rounded-lg">
              <Mic className="h-5 w-5 text-yellow-100" />
            </div>
            <div>
              <h4 className="font-medium">Allow Microphone Access</h4>
              <p className="text-sm text-yellow-100/80">When prompted by your browser, click "Allow" to enable microphone access.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-yellow-100/20 p-2 rounded-lg">
              <Headphones className="h-5 w-5 text-yellow-100" />
            </div>
            <div>
              <h4 className="font-medium">Use Headphones</h4>
              <p className="text-sm text-yellow-100/80">For the best experience, we recommend using headphones to prevent audio feedback.</p>
            </div>
          </div>
          {error && (
            <div className="flex items-start gap-3 bg-red-900/50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-100 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-100/90">{error}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-yellow-100 hover:text-yellow-200 hover:bg-yellow-100/20"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            className="bg-yellow-100 text-red-600 hover:text-red-700 hover:bg-yellow-200"
            disabled={isLoading}
          >
            {isLoading ? "Requesting Access..." : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 