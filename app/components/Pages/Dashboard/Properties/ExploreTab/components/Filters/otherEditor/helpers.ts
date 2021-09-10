export function createYearArray(start = new Date().getFullYear(), end = 1990) {
  return [
    null,
    ...Array.from({ length: (end - start) / -1 + 1 }, (_, i) => start + i * -1)
  ]
}
