import { ONE_DAY_IN_SECONDS } from '../constants'

export function getDaysFromSeconds(seconds: number): number {
  return Math.floor(seconds / ONE_DAY_IN_SECONDS)
}
