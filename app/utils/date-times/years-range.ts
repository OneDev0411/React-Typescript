export function getYearsRange() {
  const startYear = new Date().getFullYear() + 1

  return new Array(4).fill(null).map((_, index) => startYear - index)
}
