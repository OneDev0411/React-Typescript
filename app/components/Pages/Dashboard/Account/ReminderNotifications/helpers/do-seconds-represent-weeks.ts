import { ONE_WEEK_IN_SECONDS } from '../constants'

export function doSecondsRepresentWeeks(seconds: number): boolean {
  return seconds % ONE_WEEK_IN_SECONDS === 0
}
