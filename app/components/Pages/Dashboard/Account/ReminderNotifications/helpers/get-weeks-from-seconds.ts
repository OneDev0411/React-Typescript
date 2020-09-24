import { ONE_WEEK_IN_SECONDS } from '../constants'

export function getWeeksFromSeconds(seconds: number): number {
  return Math.floor(seconds / ONE_WEEK_IN_SECONDS)
}
