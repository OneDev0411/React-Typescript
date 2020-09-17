import { oneWeekInSeconds } from '../constants'

export function getWeeksFromSeconds(seconds: number): number {
  return Math.floor(seconds / oneWeekInSeconds)
}
