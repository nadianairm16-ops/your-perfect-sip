import type { Drink } from './types'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

const flavorFamilies = {
  Espresso: ['Caramel', 'Vanilla', 'Hazelnut', 'Classic', 'Brown Sugar'],
  Matcha: ['Lavender', 'Classic'],
  'Frappuccino Base': ['White Mocha', 'Caramel', 'Vanilla', 'Hazelnut'],
  Refresher: ['Raspberry', 'Classic'],
  Tea: ['Lavender', 'Cinnamon Dolce', 'Classic'],
  Chai: ['Vanilla', 'Cinnamon Dolce', 'Classic'],
  Americano: ['Hazelnut', 'Vanilla', 'Classic'],
} as const

export function scoreDrink(drink: Drink) {
  let score = 100
  const feedback: string[] = []
  const syrupCount = drink.syrups.length
  const syrupNames = drink.syrups.map((item) => item.syrup)

  if (drink.temperature === 'Hot' && drink.iceLevel !== 'No Ice') {
    score -= 10
    feedback.push('Hot drinks should stay cozy without ice.')
  }

  if (drink.temperature !== 'Hot' && drink.iceLevel === 'No Ice') {
    score -= 8
    feedback.push('Iced drinks benefit from at least a touch of ice.')
  }

  if (drink.base === 'Refresher' && drink.temperature !== 'Iced') {
    score -= 25
    feedback.push('Refresher ingredients shine best cold.')
  }

  if (drink.base === 'Frappuccino Base' && drink.temperature === 'Hot') {
    score -= 20
    feedback.push('A Frappuccino base is happiest blended or iced.')
  }

  if (drink.base === 'Matcha' && drink.temperature === 'Hot' && drink.syrups.length >= 3) {
    score -= 10
    feedback.push('Matcha can feel crowded with too many syrup pumps.')
  }

  if (syrupCount > 3) {
    score -= (syrupCount - 3) * 6
    feedback.push('Try simplifying the syrup blend for a cleaner flavor.')
  }

  if (drink.drizzles.length > 1) {
    score -= 6
    feedback.push('A single drizzle often reads more elegant than multiple sauces.')
  }

  if (drink.toppings.includes('Whipped Cream') && drink.base === 'Tea') {
    score -= 5
    feedback.push('Tea and whipped cream can be a bit heavy together.')
  }

  if (drink.extras.includes('Extra Shot') && drink.base !== 'Espresso' && drink.base !== 'Americano') {
    score -= 8
    feedback.push('Extra shots are most natural in espresso-forward recipes.')
  }

  if (drink.milk === 'None' && drink.base === 'Espresso' && drink.temperature === 'Hot') {
    score -= 8
    feedback.push('Espresso can feel too sharp without a creamy base at warm temperature.')
  }

  const preferredSyrups = flavorFamilies[drink.base].filter((item) => syrupNames.includes(item))
  if (preferredSyrups.length === 0 && syrupCount > 0) {
    score -= 7
    feedback.push('Consider pairing syrups that echo the base flavor.')
  }

  if (drink.toppings.length > 2) {
    score -= 5
    feedback.push('A lighter topping palette helps the core drink shine.')
  }

  if (drink.drizzles.length === 0 && drink.toppings.includes('Whipped Cream')) {
    score += 4
  }

  if (drink.charm !== 'None') {
    score += 3
    feedback.push('The charm adds a sweet finishing touch.')
  }

  if (drink.extras.includes('Decaf')) {
    score += 2
  }

  const uniqueBalance = new Set([
    drink.base,
    drink.milk,
    drink.temperature,
    ...drink.syrups.map((item) => item.syrup),
    ...drink.toppings,
    ...drink.drizzles,
    ...drink.extras,
  ]).size
  if (uniqueBalance > 12) {
    score -= 8
    feedback.push('The drink is ambitious, but less can sometimes taste more delicious.')
  }

  score = clamp(score, 0, 100)

  if (score >= 98) {
    feedback.unshift('The critic is delighted — your drink feels beautifully balanced.')
  } else if (score >= 80) {
    feedback.unshift('Great job — this creation has a lot of cozy charm.')
  } else if (score >= 60) {
    feedback.unshift('Your concept is interesting, but a few adjustments would sharpen it.')
  } else {
    feedback.unshift('Tinker with the base and sweetness balance to make this drink sing.')
  }

  if (score === 100) {
    feedback.splice(1, 0, 'Perfection! Every part of this drink is in harmony.')
  }

  const uniqueFeedback = [...new Set(feedback)].slice(0, 3)

  return {
    score,
    feedback: uniqueFeedback,
  }
}
