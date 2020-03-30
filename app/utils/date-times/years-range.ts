export function getYearsRange() {
  const startYear = new Date().getFullYear() + 5

  return new Array(12).fill(null).map((_, index) => startYear - index)
}
