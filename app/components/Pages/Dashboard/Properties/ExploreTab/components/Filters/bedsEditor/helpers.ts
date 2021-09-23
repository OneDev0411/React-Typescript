export function createBedArray({
  length = 10,
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

  const rawArray = [null, ...Array.from({ length }, (_, i) => i + 1)]

  if (min) {
    return rawArray.filter(item => item === null || item > min)
  }

  if (max) {
    return rawArray.filter(item => item === null || item < max)
  }

  return rawArray
}
