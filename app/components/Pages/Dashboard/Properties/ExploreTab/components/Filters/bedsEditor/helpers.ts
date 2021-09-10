export function createBedArray(length: number = 10) {
  return [null, ...Array.from({ length }, (_, i) => i + 1)]
}
