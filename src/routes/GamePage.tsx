import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Sparkles, RefreshCcw, Play, Award } from 'lucide-react'
import { useAppStore } from '../lib/store'

const ingredientList = ['Espresso', 'Milk', 'Matcha', 'Syrup', 'Ice', 'Whip']

interface Note {
  id: string
  label: string
  x: number
  y: number
  hit: boolean
}

export default function GamePage() {
  const unlocked = useAppStore((state) => state.unlocked)
  const highScore = useAppStore((state) => state.highScore)
  const setHighScore = useAppStore((state) => state.setHighScore)

  const [running, setRunning] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(25)
  const [round, setRound] = useState(0)

  const secretDrink = useMemo(
    () => ({
      name: 'Original Frappuccino',
      description:
        'A secret creamy Frappuccino with velvet cold foam, dark mocha ribbon, and a sprinkle of nostalgia. Unlock the rhythm to mix the perfect sip.',
      details: ['Venti', 'Blended', 'Frappuccino Base', 'Whole Milk', 'Whipped Cream', 'Mocha Drizzle'],
    }),
    [],
  )

  useEffect(() => {
    if (!running) return
    const ticker = window.setInterval(() => {
      setNotes((current) =>
        current
          .map((note) => ({ ...note, y: note.y + 4 }))
          .filter((note) => note.y < 420),
      )
    }, 20)
    return () => window.clearInterval(ticker)
  }, [running])

  useEffect(() => {
    if (!running) return
    const spawn = window.setInterval(() => {
      setNotes((current) => [
        ...current,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          label: ingredientList[Math.floor(Math.random() * ingredientList.length)],
          x: 10 + Math.random() * 75,
          y: -50,
          hit: false,
        },
      ])
    }, 1200)
    return () => window.clearInterval(spawn)
  }, [running])

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setRunning(false)
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (!running && timeLeft === 0) {
      setHighScore(score)
    }
  }, [running, timeLeft, score, setHighScore])

  const handleTap = (noteId: string) => {
    setNotes((current) =>
      current.map((note) => {
        if (note.id !== noteId) return note
        const withinZone = note.y >= 250 && note.y <= 330
        if (withinZone && !note.hit) {
          setScore((currentScore) => currentScore + 12)
          return { ...note, hit: true }
        }
        setScore((currentScore) => Math.max(0, currentScore - 6))
        return note
      }),
    )
  }

  const resetGame = () => {
    setRunning(false)
    setNotes([])
    setScore(0)
    setTimeLeft(25)
    setRound((current) => current + 1)
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center">
        <div className="rounded-[2.4rem] border border-coffee/10 bg-white/90 p-10 shadow-soft">
          <Lock className="mx-auto mb-4 h-12 w-12 text-coffee/70" />
          <h1 className="text-3xl font-semibold text-coffee">Game locked</h1>
          <p className="mt-4 text-sm leading-7 text-coffee/75">
            Score five perfect drinks in a row with the Capybara Critic to unlock this cozy rhythm mixing challenge.
          </p>
          <button
            type="button"
            onClick={() => window.location.assign('/builder')}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-sage px-6 py-4 text-sm font-semibold text-coffee transition hover:bg-sage/90"
          >
            Start building now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl py-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[2.4rem] border border-coffee/10 bg-white/90 p-8 shadow-soft"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-coffee/60">Secret game</p>
              <h1 className="mt-3 text-4xl font-semibold text-coffee">Original Frappuccino</h1>
            </div>
            <div className="rounded-3xl bg-latte/90 px-4 py-3 text-sm text-coffee/80">High score: {highScore}</div>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-7 text-coffee/75">
            Mix the secret drink by tapping ingredients at just the right moment. The better your timing, the higher your score. Keep an eye on the rhythm lane and feel the café groove.
          </p>

          <div className="mt-8 rounded-[2rem] border border-coffee/10 bg-cream/95 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-coffee/60">Secret recipe</p>
            <ul className="mt-4 space-y-2 text-sm text-coffee/75">
              {secretDrink.details.map((detail) => (
                <li key={detail} className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-sage" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (running) {
                  resetGame()
                } else {
                  setRunning(true)
                  setTimeLeft(25)
                }
              }}
              className="inline-flex items-center gap-2 rounded-full bg-coffee px-6 py-4 text-sm font-semibold text-cream transition hover:bg-coffee/90"
            >
              {running ? <RefreshCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />} 
              {running ? 'Restart Round' : 'Start Game'}
            </button>
            <div className="rounded-3xl border border-coffee/10 bg-white/90 px-4 py-3 text-sm text-coffee">
              Time left: <span className="font-semibold text-coffee/90">{timeLeft}s</span>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-[2.4rem] border border-coffee/10 bg-cream/95 p-6 shadow-soft"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-coffee/10 bg-white/95 p-4">
            <div className="absolute inset-x-0 top-0 h-2 bg-sage/20" />
            <div className="relative h-[420px] overflow-hidden rounded-[1.5rem] bg-coffee/5">
              <div className="absolute inset-x-0 top-[250px] mx-auto h-24 w-full border-t border-dashed border-coffee/30" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-coffee/10 to-transparent" />
              {notes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => handleTap(note.id)}
                  className={`absolute inline-flex -translate-x-1/2 transform items-center justify-center rounded-full border border-coffee/15 px-4 py-3 text-xs font-semibold transition ${
                    note.hit ? 'bg-sage/80 text-white' : 'bg-white text-coffee shadow-soft'
                  }`}
                  style={{ top: note.y, left: `${note.x}%` }}
                >
                  {note.label}
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-[1.5rem] border border-coffee/10 bg-cream px-5 py-4 text-sm text-coffee/75">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-coffee/50">Score</p>
                <p className="mt-2 text-3xl font-semibold text-coffee">{score}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.28em] text-coffee/50">Round</p>
                <p className="mt-2 text-3xl font-semibold text-coffee">{round || 1}</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
