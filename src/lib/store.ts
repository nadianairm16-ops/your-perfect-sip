import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PRESET_DRINKS } from './presets'
import type { Drink, ScoreResult } from './types'

const defaultDrink: Drink = {
  id: 'draft',
  name: 'Morning Muse',
  size: 'Grande',
  temperature: 'Hot',
  base: 'Espresso',
  milk: 'Whole Milk',
  syrups: [],
  iceLevel: 'Regular Ice',
  toppings: [],
  drizzles: [],
  extras: [],
  charm: 'None',
  createdAt: Date.now(),
}

interface AppState {
  streak: number
  unlocked: boolean
  highScore: number
  currentDrink: Drink
  savedDrinks: Drink[]
  setCurrentDrink: (payload: Partial<Drink>) => void
  resetCurrentDrink: () => void
  addSavedDrink: (drink: Drink) => void
  recordScore: (score: number) => void
  setUnlocked: (value: boolean) => void
  loadPreset: (presetName: string) => void
  setHighScore: (score: number) => void
}

function buildSavedDrink(drink: Drink): Drink {
  return {
    ...drink,
    id: `${drink.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
    createdAt: Date.now(),
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      streak: 0,
      unlocked: false,
      highScore: 0,
      currentDrink: defaultDrink,
      savedDrinks: [],
      setCurrentDrink: (payload) =>
        set((state) => ({
          currentDrink: { ...state.currentDrink, ...payload },
        })),
      resetCurrentDrink: () => set({ currentDrink: defaultDrink }),
      addSavedDrink: (drink) =>
        set((state) => ({
          savedDrinks: [buildSavedDrink(drink), ...state.savedDrinks],
        })),
      recordScore: (score) =>
        set((state) => {
          const streak = score === 100 ? Math.min(state.streak + 1, 5) : 0
          const unlocked = state.unlocked || streak === 5
          return { streak, unlocked }
        }),
      setUnlocked: (value) => set({ unlocked: value }),
      loadPreset: (presetName) => {
        const preset = PRESET_DRINKS.find((item) => item.name === presetName)
        if (preset) {
          set({ currentDrink: { ...preset, id: 'draft', createdAt: Date.now() } })
        }
      },
      setHighScore: (score) =>
        set((state) => ({ highScore: Math.max(state.highScore, score) })),
    }),
    {
      name: 'the-drink-dream-state',
      partialize: (state) => ({
        streak: state.streak,
        unlocked: state.unlocked,
        highScore: state.highScore,
        savedDrinks: state.savedDrinks,
        currentDrink: state.currentDrink,
      }),
    },
  ),
)
