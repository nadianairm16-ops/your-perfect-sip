import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PRESET_DRINKS } from './presets'
import type { Drink, ScoreResult } from './types'

const safeStorage = {
  getItem: (name: string) => {
    try {
      return window.localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string) => {
    try {
      window.localStorage.setItem(name, value)
    } catch {
      // ignore storage errors
    }
  },
  removeItem: (name: string) => {
    try {
      window.localStorage.removeItem(name)
    } catch {
      // ignore remove failures
    }
  },
}

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

const persistedStore = persist(
  (set: any, get: any) => ({
    streak: 0,
    unlocked: false,
    highScore: 0,
    currentDrink: defaultDrink,
    savedDrinks: [],
    setCurrentDrink: (payload: Partial<Drink>) =>
      set((state: any) => ({
        currentDrink: { ...state.currentDrink, ...payload },
      })),
    resetCurrentDrink: () => set({ currentDrink: defaultDrink }),
    addSavedDrink: (drink: Drink) =>
      set((state: any) => ({
        savedDrinks: [buildSavedDrink(drink), ...state.savedDrinks],
      })),
    recordScore: (score: number) =>
      set((state: any) => {
        const streak = score === 100 ? Math.min(state.streak + 1, 5) : 0
        const unlocked = state.unlocked || streak === 5
        return { streak, unlocked }
      }),
    setUnlocked: (value: boolean) => set({ unlocked: value }),
    loadPreset: (presetName: string) => {
      const preset = PRESET_DRINKS.find((item) => item.name === presetName)
      if (preset) {
        set({ currentDrink: { ...preset, id: 'draft', createdAt: Date.now() } })
      }
    },
    setHighScore: (score: number) =>
      set((state: any) => ({ highScore: Math.max(state.highScore, score) })),
  }),
  {
    name: 'the-drink-dream-state',
    storage: safeStorage as any,
    serialize: (state: any) => JSON.stringify(state),
    deserialize: (str: any) => {
      try {
        return JSON.parse(str)
      } catch {
        return undefined
      }
    },
    partialize: (state: any) => ({
      streak: state.streak,
      unlocked: state.unlocked,
      highScore: state.highScore,
      savedDrinks: state.savedDrinks,
      currentDrink: state.currentDrink,
    }),
  } as any,
) as any

export const useAppStore = create<AppState>()(persistedStore)
