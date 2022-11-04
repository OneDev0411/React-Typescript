import { calculatePrecentage } from './calculate-precentage'

export function getValuePercent(value: number, total: number): string {
  const percent = calculatePrecentage(value, total)

  if (percent === 0) {
    return value.toString()
  }

  return percent === 0 ? value.toString() : `${value} (${percent}%)`
}
