import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Minus, Sparkles, Save, Activity } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { scoreDrink } from '../lib/scoring'
import { PRESET_DRINKS } from '../lib/presets'
import CupPreview from '../components/CupPreview'
import CriticalModal from '../components/CriticalModal'
import type { Syrup, Extra, Topping, Drizzle, Charm, IceLevel, Milk, Base, Temperature, Size } from '../lib/types'

const sizes: Size[] = ['Tall', 'Grande', 'Venti']
const temperatures: Temperature[] = ['Hot', 'Iced', 'Blended']
const bases: Base[] = ['Espresso', 'Matcha', 'Frappuccino Base', 'Refresher', 'Tea', 'Chai', 'Americano']
const milks: Milk[] = ['Whole Milk', '2% Milk', 'Oat Milk', 'Almond Milk', 'Coconut Milk', 'Soy Milk', 'None']
const syrupOptions: Syrup[] = [
  'Vanilla',
  'Caramel',
  'Hazelnut',
  'Brown Sugar',
  'Lavender',
  'Raspberry',
  'Peppermint',
  'Toffee Nut',
  'Cinnamon Dolce',
  'White Mocha',
  'Classic',
]
const iceLevels: IceLevel[] = ['No Ice', 'Light Ice', 'Regular Ice', 'Extra Ice']
const toppings: Topping[] = [
  'Cold Foam',
  'Sweet Cream',
  'Whipped Cream',
  'Matcha Powder',
  'Cinnamon Powder',
  'Chocolate Chips',
  'Caramel Ribbon Crunch',
  'Cookie Crumble',
]
const drizzles: Drizzle[] = ['Caramel Drizzle', 'Mocha Drizzle', 'White Mocha Drizzle', 'Honey']
const extras: Extra[] = ['Extra Shot', 'Decaf', 'Vanilla Sweet Cream', 'Salted Caramel Bits', 'Protein Powder']
const charms: Charm[] = ['🌸', '⭐', '🌙', '🍓', '🐾', '💎', '🍃', 'None']

export default function BuilderPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const drink = useAppStore((state) => state.currentDrink)
  const setCurrentDrink = useAppStore((state) => state.setCurrentDrink)
  const addSavedDrink = useAppStore((state) => state.addSavedDrink)
  const recordScore = useAppStore((state) => state.recordScore)
  const unlocked = useAppStore((state) => state.unlocked)
  const streak = useAppStore((state) => state.streak)

  const [savedMessage, setSavedMessage] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [scoreResult, setScoreResult] = useState<ReturnType<typeof scoreDrink> | null>(null)
  const [justUnlocked, setJustUnlocked] = useState(false)

  const presetName = useMemo(() => new URLSearchParams(location.search).get('preset') ?? '', [location.search])

  useEffect(() => {
    if (!presetName) return
    const preset = PRESET_DRINKS.find((item) => item.name === presetName)
    if (preset) {
      setCurrentDrink({ ...preset, id: 'draft', createdAt: Date.now() })
    }
  }, [presetName, setCurrentDrink])

  const toggleArray = <T extends string>(field: 'toppings' | 'drizzles' | 'extras', value: T) => {
    const active = drink[field] as T[]
    const next = active.includes(value) ? active.filter((item) => item !== value) : [...active, value]
    setCurrentDrink({ [field]: next } as any)
  }

  const toggleSyrup = (syrup: Syrup) => {
    const active = drink.syrups.find((item) => item.syrup === syrup)
    if (active) {
      setCurrentDrink({ syrups: drink.syrups.filter((item) => item.syrup !== syrup) })
    } else {
      setCurrentDrink({ syrups: [...drink.syrups, { syrup, pumps: 1 }] })
    }
  }

  const adjustPump = (syrup: Syrup, delta: number) => {
    const syrups = drink.syrups.map((item) =>
      item.syrup === syrup ? { ...item, pumps: Math.min(5, Math.max(1, item.pumps + delta)) } : item,
    )
    setCurrentDrink({ syrups })
  }

  const onSave = () => {
    addSavedDrink(drink)
    setSavedMessage('Saved! Your drink is in the roster.')
    setTimeout(() => setSavedMessage(''), 2500)
  }

  const onScore = () => {
    const result = scoreDrink(drink)
    setScoreResult(result)
    setModalOpen(true)
    const previousStreak = streak
    recordScore(result.score)
    setJustUnlocked(!unlocked && previousStreak + (result.score === 100 ? 1 : 0) >= 5)
  }

  const handleSaveFromModal = () => {
    addSavedDrink(drink)
    setModalOpen(false)
    setSavedMessage('Perfect! Drink saved to your collection.')
    setTimeout(() => setSavedMessage(''), 2500)
  }

  return (
    <div className="mx-auto max-w-4xl py-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[2.4rem] border border-coffee/10 bg-white/90 p-6 shadow-soft sm:p-8"
        >
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-coffee/60">Create a custom sip</p>
              <h1 className="mt-3 text-2xl font-semibold text-coffee sm:text-3xl">Your builder</h1>
            </div>
            <div className="rounded-3xl border border-coffee/10 bg-latte/85 px-4 py-3 text-sm text-coffee/75">
              Streak: {streak} / 5
            </div>
          </div>

          <div className="space-y-8">
            <section className="rounded-[1.8rem] border border-coffee/10 bg-cream/95 p-6">
              <label className="block text-sm font-semibold text-coffee">Drink name</label>
              <input
                value={drink.name}
                onChange={(event) => setCurrentDrink({ name: event.target.value })}
                placeholder="e.g. Cozy Caramel Cloud"
                className="mt-3 w-full rounded-3xl border border-coffee/10 bg-white/90 px-4 py-4 text-coffee shadow-sm outline-none transition focus:border-coffee/50"
              />
            </section>

            <section className="grid gap-6 rounded-[1.8rem] border border-coffee/10 bg-cream/95 p-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-coffee">Size</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setCurrentDrink({ size })}
                      className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                        drink.size === size ? 'bg-coffee text-cream' : 'bg-white/90 text-coffee hover:bg-latte'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-coffee">Temperature</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {temperatures.map((temperature) => (
                    <button
                      key={temperature}
                      type="button"
                      onClick={() => setCurrentDrink({ temperature })}
                      className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                        drink.temperature === temperature ? 'bg-sage text-coffee' : 'bg-white/90 text-coffee hover:bg-latte'
                      }`}
                    >
                      {temperature}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 rounded-[1.8rem] border border-coffee/10 bg-cream/95 p-6 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-coffee">Base</label>
                <select
                  value={drink.base}
                  onChange={(event) => setCurrentDrink({ base: event.target.value as Base })}
                  className="mt-4 w-full rounded-3xl border border-coffee/10 bg-white/90 px-4 py-4 text-coffee shadow-sm outline-none transition"
                >
                  {bases.map((base) => (
                    <option key={base} value={base}>{base}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-coffee">Milk</label>
                <select
                  value={drink.milk}
                  onChange={(event) => setCurrentDrink({ milk: event.target.value as Milk })}
                  className="mt-4 w-full rounded-3xl border border-coffee/10 bg-white/90 px-4 py-4 text-coffee shadow-sm outline-none transition"
                >
                  {milks.map((milk) => (
                    <option key={milk} value={milk}>{milk}</option>
                  ))}
                </select>
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-coffee/10 bg-cream/95 p-6">
              <p className="text-sm font-semibold text-coffee">Syrups</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {syrupOptions.map((syrup) => {
                  const active = drink.syrups.some((item) => item.syrup === syrup)
                  const current = drink.syrups.find((item) => item.syrup === syrup)
                  return (
                    <div key={syrup} className="rounded-[1.5rem] border border-coffee/10 bg-white/90 p-4 shadow-sm">
                      <button
                        type="button"
                        onClick={() => toggleSyrup(syrup)}
                        className={`w-full rounded-3xl px-4 py-3 text-left text-sm font-semibold transition ${
                          active ? 'bg-coffee text-cream' : 'bg-cream text-coffee hover:bg-latte'
                        }`}
                      >
                        {syrup}
                      </button>
                      {active ? (
                        <div className="mt-3 flex items-center justify-between gap-3 text-sm text-coffee">
                          <button
                            type="button"
                            onClick={() => adjustPump(syrup, -1)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-coffee/15 bg-cream text-coffee"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-semibold">{current?.pumps ?? 1} pump{current?.pumps === 1 ? '' : 's'}</span>
                          <button
                            type="button"
                            onClick={() => adjustPump(syrup, 1)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-coffee/15 bg-cream text-coffee"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </section>

            {drink.temperature !== 'Hot' ? (
              <section className="rounded-[1.8rem] border border-coffee/10 bg-cream/95 p-6">
                <p className="text-sm font-semibold text-coffee">Ice level</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {iceLevels.map((ice) => (
                    <button
                      key={ice}
                      type="button"
                      onClick={() => setCurrentDrink({ iceLevel: ice })}
                      className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                        drink.iceLevel === ice ? 'bg-coffee text-cream' : 'bg-white/90 text-coffee hover:bg-latte'
                      }`}
                    >
                      {ice}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-[1.8rem] border border-coffee/10 bg-cream/95 p-6">
              <p className="text-sm font-semibold text-coffee">Toppings</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {toppings.map((topping) => (
                  <button
                    key={topping}
                    type="button"
                    onClick={() => toggleArray('toppings', topping)}
                    className={`rounded-3xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      drink.toppings.includes(topping)
                        ? 'border-coffee bg-coffee text-cream'
                        : 'border-coffee/10 bg-white/90 text-coffee hover:border-coffee/30'
                    }`}
                  >
                    {topping}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-coffee/10 bg-cream/95 p-6">
              <p className="text-sm font-semibold text-coffee">Drizzles</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {drizzles.map((drizzle) => (
                  <button
                    key={drizzle}
                    type="button"
                    onClick={() => toggleArray('drizzles', drizzle)}
                    className={`rounded-3xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      drink.drizzles.includes(drizzle)
                        ? 'border-coffee bg-coffee text-cream'
                        : 'border-coffee/10 bg-white/90 text-coffee hover:border-coffee/30'
                    }`}
                  >
                    {drizzle}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-coffee/10 bg-cream/95 p-6">
              <p className="text-sm font-semibold text-coffee">Extras</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {extras.map((extra) => (
                  <button
                    key={extra}
                    type="button"
                    onClick={() => toggleArray('extras', extra)}
                    className={`rounded-3xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      drink.extras.includes(extra)
                        ? 'border-coffee bg-coffee text-cream'
                        : 'border-coffee/10 bg-white/90 text-coffee hover:border-coffee/30'
                    }`}
                  >
                    {extra}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-coffee/10 bg-cream/95 p-6">
              <p className="text-sm font-semibold text-coffee">Cup charm</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {charms.map((charm) => (
                  <button
                    key={charm}
                    type="button"
                    onClick={() => setCurrentDrink({ charm })}
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl border text-2xl transition ${
                      drink.charm === charm ? 'border-coffee bg-coffee text-cream' : 'border-coffee/10 bg-white/90 text-coffee hover:bg-latte'
                    }`}
                  >
                    {charm}
                  </button>
                ))}
              </div>
            </section>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onSave}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-coffee/10 bg-white px-6 py-4 text-sm font-semibold text-coffee transition hover:bg-cream"
              >
                <Save className="h-4 w-4" /> Save the drink
              </button>
              <button
                type="button"
                onClick={onScore}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-coffee px-6 py-4 text-sm font-semibold text-cream transition hover:bg-coffee/90"
              >
                <Activity className="h-4 w-4" /> Get Scored!
              </button>
            </div>
            {savedMessage ? (
              <p className="rounded-3xl bg-sage/15 px-4 py-3 text-sm text-sage">{savedMessage}</p>
            ) : null}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-[2.4rem] border border-coffee/10 bg-cream/95 p-6 shadow-soft"
        >
          <CupPreview drink={drink} />
        </motion.section>
      </div>

      <CriticalModal
        open={modalOpen}
        scoreResult={scoreResult}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveFromModal}
        justUnlocked={justUnlocked}
      />
    </div>
  )
}
