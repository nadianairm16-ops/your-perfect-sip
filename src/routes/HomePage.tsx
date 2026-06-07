import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { PRESET_DRINKS } from '../lib/presets'
import { useAppStore } from '../lib/store'
import DrinkCard from '../components/DrinkCard'

export default function HomePage() {
  const navigate = useNavigate()
  const streak = useAppStore((state) => state.streak)
  const unlocked = useAppStore((state) => state.unlocked)

  return (
    <div className="mx-auto max-w-5xl py-10 lg:py-14">
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="rounded-[2.4rem] border border-coffee/10 bg-white/90 p-8 shadow-soft sm:p-10">
          <div className="rounded-[2rem] border border-coffee/10 bg-cream/90 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-coffee/60">Design the drink only you would order</p>
            <h1 className="mt-4 text-4xl font-semibold text-coffee sm:text-5xl lg:text-6xl">Design the drink only you would order</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-coffee/75 sm:text-lg">
              Customize every detail from the base to the charm, then let the Capybara Critic judge your creation.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/builder')}
                className="inline-flex items-center justify-center rounded-full bg-coffee px-6 py-4 text-sm font-semibold text-cream transition hover:bg-coffee/90"
              >
                Start Building
              </button>
              <button
                type="button"
                onClick={() => unlocked && navigate('/game')}
                className={`inline-flex items-center justify-center rounded-full border border-coffee/10 px-6 py-4 text-sm font-semibold transition ${
                  unlocked
                    ? 'bg-sage text-coffee hover:bg-sage/90'
                    : 'cursor-not-allowed bg-cream text-coffee/40'
                }`}
              >
                {unlocked ? 'Play the Secret Game' : 'Unlock the Game'}
              </button>
            </div>
          </div>

          <div className="mt-10 rounded-[2.4rem] border border-coffee/10 bg-latte/80 p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-coffee/60">Streak tracker</p>
            <div className="mt-6 flex items-center gap-3">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`h-4 w-4 rounded-full border border-coffee/15 ${
                    index < streak ? 'bg-coffee' : 'bg-white'
                  }`}
                />
              ))}
              <span className="ml-4 text-sm text-coffee/70">{streak} / 5 perfect scores</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-[2.4rem] border border-coffee/10 bg-coffee/5 p-6 shadow-soft">
            <div className="scroll-mask overflow-hidden rounded-[2rem] border border-coffee/10 bg-white/90 px-4 py-5">
              <div className="marquee whitespace-nowrap text-base uppercase tracking-[0.34em] text-coffee/75">
                {Array.from({ length: 12 }, (_, index) => (
                  <span key={index} className="mr-8 inline-block">THE DRINK DREAM ★ COFFEE CO.</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2.4rem] border border-coffee/10 bg-white/90 p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.32em] text-coffee/60">House Signatures</p>
            <div className="mt-6 grid gap-6">
              {PRESET_DRINKS.map((drink) => (
                <DrinkCard key={drink.id} drink={drink} onSelect={(name) => navigate(`/builder?preset=${encodeURIComponent(name)}`)} />
              ))}
            </div>
          </div>

          <div className="rounded-[2.4rem] border border-coffee/10 bg-cream/95 p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-coffee/60">About</p>
            <p className="mt-4 text-sm leading-7 text-coffee/75">
              The Drink Dream is a handcrafted place to design a cozy coffee creation, save your favorites, and earn your way to a secret game. Every detail is designed to feel warm, tactile, and delightfully playful.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
