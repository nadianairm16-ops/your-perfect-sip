export type Size = 'Tall' | 'Grande' | 'Venti'
export type Temperature = 'Hot' | 'Iced' | 'Blended'
export type Base = 'Espresso' | 'Matcha' | 'Frappuccino Base' | 'Refresher' | 'Tea' | 'Chai' | 'Americano'
export type Milk = 'Whole Milk' | '2% Milk' | 'Oat Milk' | 'Almond Milk' | 'Coconut Milk' | 'Soy Milk' | 'None'
export type IceLevel = 'No Ice' | 'Light Ice' | 'Regular Ice' | 'Extra Ice'
export type Syrup =
  | 'Vanilla'
  | 'Caramel'
  | 'Hazelnut'
  | 'Brown Sugar'
  | 'Lavender'
  | 'Raspberry'
  | 'Peppermint'
  | 'Toffee Nut'
  | 'Cinnamon Dolce'
  | 'White Mocha'
  | 'Classic'
export type Topping =
  | 'Cold Foam'
  | 'Sweet Cream'
  | 'Whipped Cream'
  | 'Matcha Powder'
  | 'Cinnamon Powder'
  | 'Chocolate Chips'
  | 'Caramel Ribbon Crunch'
  | 'Cookie Crumble'
export type Drizzle = 'Caramel Drizzle' | 'Mocha Drizzle' | 'White Mocha Drizzle' | 'Honey'
export type Extra = 'Extra Shot' | 'Decaf' | 'Vanilla Sweet Cream' | 'Salted Caramel Bits' | 'Protein Powder'
export type Charm = '🌸' | '⭐' | '🌙' | '🍓' | '🐾' | '💎' | '🍃' | 'None'

export interface SyrupSelection {
  syrup: Syrup
  pumps: number
}

export interface Drink {
  id: string
  name: string
  size: Size
  temperature: Temperature
  base: Base
  milk: Milk
  syrups: SyrupSelection[]
  iceLevel: IceLevel
  toppings: Topping[]
  drizzles: Drizzle[]
  extras: Extra[]
  charm: Charm
  createdAt: number
}

export interface ScoreResult {
  score: number
  feedback: string[]
}
