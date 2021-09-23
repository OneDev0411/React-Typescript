export function createPriceArray({
  length = 15,
  min,
  max
}: {
  length?: number
  min?: Nullable<number>
  max?: Nullable<number>
}) {
  if (min && max) {
    throw new Error('You cant have both min and max')
  }

  const rawArray = [
    null,
    ...Array.from({ length }, (_, i) => 25000 * (i + 1)),
    800000,
    1000000,
    1500000,
    2000000,
    2500000,
    3000000,
    5000000
  ]

  if (min) {
    return rawArray.filter(item => item === null || item > min)
  }

  if (max) {
    return rawArray.filter(item => item === null || item < max)
  }

  return rawArray
}

export function ConvertPriceShortFormat(price: number) {
  let priceString = ''

  if (price > 999 && price < 1000000) {
    priceString = `${price / 1000}K`
  } else if (price >= 1000000) {
    priceString = `${(price / 1000000).toFixed(1)}M`
  } else if (price <= 999) {
    priceString = price.toString()
  }

  return `$${priceString}`
}
