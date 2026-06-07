import { motion } from 'framer-motion'
import type { Drink } from '../lib/types'

const baseColors: Record<Drink['base'], string> = {
  Espresso: '#9d6947',
  Matcha: '#89ab73',
  'Frappuccino Base': '#c4a2d8',
  Refresher: '#f1a3a9',
  Tea: '#d4b476',
  Chai: '#e1a87a',
  Americano: '#7d5b3d',
}

const milkColors: Record<Drink['milk'], string> = {
  'Whole Milk': '#f4e7d6',
  '2% Milk': '#ede1d3',
  'Oat Milk': '#f1e4d8',
  'Almond Milk': '#ece0d2',
  'Coconut Milk': '#f7f0e6',
  'Soy Milk': '#efe6d8',
  None: '#f1e7db',
}

export default function CupPreview({ drink }: { drink: Drink }) {
  const cupColor = baseColors[drink.base]
  const fillColor = milkColors[drink.milk]
  const showIce = drink.temperature !== 'Hot'
  const showSteam = drink.temperature === 'Hot'

  const labelRows = [
    `Name: ${drink.name || 'Custom Dream'}`,
    `Size: ${drink.size}`,
    `Temp: ${drink.temperature}`,
    `Base: ${drink.base}`,
    `Milk: ${drink.milk}`,
    `Syrups: ${drink.syrups.length ? drink.syrups.map((item) => `${item.pumps}× ${item.syrup}`).join(', ') : 'None'}`,
    `Ice: ${drink.temperature === 'Hot' ? 'N/A' : drink.iceLevel}`,
    `Toppings: ${drink.toppings.length ? drink.toppings.join(', ') : 'None'}`,
    `Drizzles: ${drink.drizzles.length ? drink.drizzles.join(', ') : 'None'}`,
    `Extras: ${drink.extras.length ? drink.extras.join(', ') : 'None'}`,
  ]

  return (
    <div className="rounded-[2.4rem] border border-coffee/10 bg-white/90 p-6 shadow-soft sm:p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-coffee/60">Live preview</p>
          <h2 className="mt-2 text-2xl font-semibold text-coffee">Cup mood</h2>
        </div>
        <div className="rounded-3xl bg-latte/90 px-3 py-2 text-xs uppercase tracking-[0.24em] text-coffee/70">
          {drink.charm !== 'None' ? 'Charmed' : 'Classic'}
        </div>
      </div>

      <div className="relative mx-auto mb-8 flex h-[340px] w-full max-w-[320px] items-end justify-center">
        <motion.div
          layout
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative flex h-[260px] w-[220px] flex-col items-center justify-end rounded-[3rem] border border-coffee/15 bg-[#fdf7f1] shadow-[inset_0_18px_45px_rgba(140,106,88,0.1)]"
          style={{ backgroundColor: '#fffaf3' }}
        >
          <div className="absolute inset-x-6 top-6 h-28 rounded-full bg-white/70 shadow-inner" />
          <div className="absolute inset-x-10 top-10 h-16 rounded-full bg-[#f5efe7]/80" />
          <div className="absolute inset-x-10 bottom-16 h-[110px] rounded-[2rem]" style={{ background: `radial-gradient(circle at 50% 20%, ${fillColor}, ${cupColor})` }}>
            {showIce ? (
              <div className="absolute inset-x-3 top-4 flex flex-wrap items-center justify-center gap-2">
                {[...Array(5)].map((_, index) => (
                  <span key={index} className="h-9 w-9 rounded-2xl bg-white/90 shadow-sm backdrop-blur-sm" />
                ))}
              </div>
            ) : null}
          </div>

          {drink.toppings.includes('Whipped Cream') ? (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute -top-10 left-1/2 w-[190px] -translate-x-1/2 rounded-[2rem] bg-white/95 p-4 shadow-soft"
            >
              <div className="h-8 rounded-full bg-slate-100 shadow-inner" />
              <div className="mt-2 h-6 rounded-full bg-slate-100 shadow-inner" />
            </motion.div>
          ) : null}

          {drink.drizzles.map((drizzle) => (
            <motion.div
              key={drizzle}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute top-20 h-1 w-[140px] rounded-full"
              style={{
                background:
                  drizzle === 'Caramel Drizzle'
                    ? '#c17e4d'
                    : drizzle === 'Mocha Drizzle'
                    ? '#6f4e3d'
                    : drizzle === 'White Mocha Drizzle'
                    ? '#f7e7d3'
                    : '#d99b64',
              }}
            />
          ))}

          {drink.charm !== 'None' ? (
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-[-18px] top-20 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-2xl shadow-soft"
            >
              {drink.charm}
            </motion.div>
          ) : null}

          {showSteam ? (
            <div className="absolute -top-20 flex flex-col gap-2">
              {['', '', ''].map((_, index) => (
                <span
                  key={index}
                  className="h-10 w-3 rounded-full bg-white/70 blur-sm"
                  style={{ opacity: 0.7 - index * 0.15 }}
                />
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>

      <div className="rounded-[2rem] border border-coffee/10 bg-cream/90 p-5 text-sm text-coffee/80 shadow-sm">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-coffee/60">Cup label</p>
        <div className="space-y-2">
          {labelRows.map((row) => (
            <p key={row} className="leading-6">
              <span className="font-semibold text-coffee/90">• </span>
              {row}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
