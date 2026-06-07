import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, RefreshCcw, Sparkles } from 'lucide-react'
import type { ScoreResult } from '../lib/types'

interface CriticalModalProps {
  open: boolean
  scoreResult: ScoreResult | null
  onClose: () => void
  onSave: () => void
  justUnlocked: boolean
}

export default function CriticalModal({ open, scoreResult, onClose, onSave, justUnlocked }: CriticalModalProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    if (!open || !scoreResult) {
      setDisplayScore(0)
      return
    }
    let current = 0
    const step = Math.max(1, Math.round(scoreResult.score / 40))
    const interval = window.setInterval(() => {
      current += step
      if (current >= scoreResult.score) {
        setDisplayScore(scoreResult.score)
        window.clearInterval(interval)
      } else {
        setDisplayScore(current)
      }
    }, 20)
    return () => window.clearInterval(interval)
  }, [open, scoreResult])

  if (!open || !scoreResult) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-coffee/20 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-soft backdrop-blur-xl sm:p-8"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-coffee/60">Capybara Critic</p>
            <h2 className="mt-3 text-3xl font-semibold text-coffee">Your drink score</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-latte/90 px-4 py-2 text-sm font-medium text-coffee shadow-sm">
            <Sparkles className="h-4 w-4 text-coffee" /> Perfect scoring streak
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-coffee/10 bg-cream/95 p-6">
            <div className="flex flex-col items-center gap-3 rounded-[1.8rem] border border-coffee/10 bg-white/80 p-6 text-center shadow-sm">
              <span className="text-6xl font-black tracking-tight text-coffee">{displayScore}</span>
              <p className="text-sm uppercase tracking-[0.3em] text-coffee/60">out of 100</p>
              <p className="mt-3 text-sm text-coffee/75">
                {scoreResult.score === 100 ? 'A flawless brew from the capybara critic.' : 'A friendly review with notes to make it even cozier.'}
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-[2rem] border border-coffee/10 bg-white/90 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coffee/60">Feedback</p>
            <ul className="space-y-2 text-sm text-coffee/75">
              {scoreResult.feedback.map((note) => (
                <li key={note} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 text-sage" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
            {justUnlocked ? (
              <div className="rounded-3xl border border-sage/20 bg-sage/10 p-4 text-sm text-sage">
                🎉 The game is unlocked! Head to the Game page and keep playing.
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-coffee/15 bg-white px-5 py-3 text-sm font-semibold text-coffee transition hover:bg-cream"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center justify-center rounded-full bg-coffee px-5 py-3 text-sm font-semibold text-cream transition hover:bg-coffee/90"
          >
            Save This Drink
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
