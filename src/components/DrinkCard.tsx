import { ArrowRight, Sparkles } from 'lucide-react'
import type { Drink } from '../lib/types'

interface DrinkCardProps {
  drink: Drink
  onSelect: (name: string) => void
}

export default function DrinkCard({ drink, onSelect }: DrinkCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-coffee/10 bg-white/80 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-coffee/60">House Signature</p>
          <h3 className="mt-2 text-xl font-semibold text-coffee">{drink.name}</h3>
        </div>
        <div className="rounded-2xl border border-coffee/10 bg-latte/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-coffee/75">
          {drink.size}
        </div>
      </div>

      <div className="space-y-3 text-sm text-coffee/75">
        <p>{drink.base} with {drink.milk}</p>
        <p>{drink.temperature} {drink.base === 'Refresher' ? 'chill' : 'sip'}</p>
        <p>{drink.syrups.length ? `${drink.syrups.map((item) => `${item.pumps}× ${item.syrup}`).join(', ')}` : 'No extra syrup'}</p>
      </div>

      <button
        type="button"
        onClick={() => onSelect(drink.name)}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-coffee px-5 py-3 text-sm font-semibold text-cream transition hover:bg-coffee/90"
      >
        Choose drink <ArrowRight className="h-4 w-4" />
      </button>

      <div className="pointer-events-none absolute -right-8 -top-6 h-24 w-24 rounded-full bg-sage/20 blur-2xl" />
      <div className="pointer-events-none absolute -left-10 bottom-10 h-24 w-24 rounded-full bg-blush/25 blur-2xl" />
    </article>
  )
}
