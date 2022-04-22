import { isAfter } from 'date-fns'

export function futureTimeValidator(value: Optional<Date>): Optional<string> {
  if (!value) {
    return
  }

  return isAfter(new Date(), value) ? 'Time must be in the future' : undefined
}
