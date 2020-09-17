import { oneWeekInSeconds } from '../constants'

export function doSecondsRepresentWeeks(seconds: number): boolean {
  return seconds % oneWeekInSeconds === 0
}
