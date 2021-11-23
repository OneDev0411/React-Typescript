// TODO: refactor this function to make it more generic
export function createPriceArray({
  propertyType,
  min,
  max
}: {
  propertyType?: IPropertyType
  min?: Nullable<number>
  max?: Nullable<number>
}) {
  if (min && max) {
    throw new Error('You cant have both min and max')
  }

  const ARR_FREQ_LENGTH_OTHER = 14
  const ARR_FREQ_LENGTH_LEASE = 17

  let rawArray: (number | null)[] = [
    ...Array.from({ length: ARR_FREQ_LENGTH_OTHER }, (_, i) => 25000 * (i + 1)),
    500000,
    800000,
    1000000,
    1500000,
    2000000,
    2500000,
    3000000,
    5000000
  ]

  if (propertyType === 'Residential Lease') {
    rawArray = [
      ...Array.from(
        { length: ARR_FREQ_LENGTH_LEASE },
        (_, i) => 150 + 50 * (i + 1)
      ),
      1500,
      2000,
      2500,
      3000,
      3500,
      4000,
      5000
    ]
  }

  if (typeof min !== 'undefined') {
    rawArray = [...rawArray, null]

    if (min) {
      return [...rawArray.filter(item => item === null || item > min)]
    }
  }

  if (typeof max !== 'undefined') {
    rawArray = [null, ...rawArray]

    if (max) {
      return [...rawArray.filter(item => item === null || item < max)]
    }
  }

  return rawArray
}

export function ConvertPriceShortFormat(price: number) {
  let priceString = ''

  if (price > 999 && price < 1000000) {
    priceString = `${price / 1000}K`
  } else if (price >= 1000000 && price < 1000000000) {
    priceString = `${(price / 1000000).toFixed(1)}M`
  } else if (price >= 1000000000) {
    priceString = `${(price / 1000000000).toFixed(1)}B`
  } else if (price <= 999) {
    priceString = price.toString()
  }

  return `$${priceString}`
}
