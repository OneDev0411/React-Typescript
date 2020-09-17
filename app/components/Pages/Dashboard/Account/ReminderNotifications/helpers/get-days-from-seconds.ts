import { oneDayInSeconds } from '../constants'

export function getDaysFromSeconds(seconds: number): number {
  return Math.floor(seconds / oneDayInSeconds)
}
