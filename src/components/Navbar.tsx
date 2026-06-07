import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Coffee, Lock, Menu, X, Sparkles } from 'lucide-react'
import { useAppStore } from '../lib/store'

const navLinks = [
  { label: 'Menu', to: '/' },
  { label: 'Build', to: '/builder' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const unlocked = useAppStore((state) => state.unlocked)

  return (
    <header className="sticky top-0 z-30 border-b border-cream/90 bg-cream/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3 text-coffee">
          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-latte text-xl shadow-soft">
            <Coffee className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-coffee/70">The Drink Dream</p>
            <p className="text-xs uppercase tracking-wide text-coffee/65">custom café</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? 'text-coffee' : 'text-coffee/75 hover:text-coffee'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-2 rounded-full border border-coffee/10 bg-white/75 px-4 py-2 text-sm text-coffee/70 shadow-soft">
            <Sparkles className="h-4 w-4" />
            {unlocked ? (
              <Link to="/game" className="font-medium text-coffee hover:text-coffee/90">
                Game
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Locked
              </div>
            )}
          </div>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-coffee/10 bg-white/90 text-coffee shadow-soft md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-coffee/10 bg-cream/95 px-4 pb-6 md:hidden">
          <div className="flex flex-col gap-3 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-medium text-coffee/80 transition hover:bg-latte/70 hover:text-coffee"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 rounded-2xl border border-coffee/10 bg-white/80 px-4 py-3 text-base text-coffee/70 shadow-soft">
              <Sparkles className="h-4 w-4" />
              {unlocked ? (
                <Link
                  to="/game"
                  onClick={() => setOpen(false)}
                  className="font-medium text-coffee hover:text-coffee/90"
                >
                  Game
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Locked
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
