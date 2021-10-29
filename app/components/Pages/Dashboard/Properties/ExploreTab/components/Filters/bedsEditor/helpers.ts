export function createBedArray({
  length = 6,
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

  let rawArray: (number | null)[] = Array.from({ length }, (_, i) => i + 1)

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
