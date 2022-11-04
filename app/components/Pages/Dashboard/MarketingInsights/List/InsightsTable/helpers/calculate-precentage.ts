export function calculatePrecentage(value: number, total: number): number {
  if (value === 0 || total === 0) {
    return 0
  }

  return Math.floor((value * 100) / total)
}
