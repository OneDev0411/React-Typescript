import { isAfter } from 'date-fns'

export function requiredTextValidator(value: string): Optional<string> {
  return !value || value.trim() === '' ? 'This field is required' : undefined
}

export function futureTimeValidator(value: Optional<Date>): Optional<string> {
  if (!value) {
    return
  }

  return isAfter(new Date(), value)
    ? 'You can not select a time in the past.'
    : undefined
}
