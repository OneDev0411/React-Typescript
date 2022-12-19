import pluralize from 'pluralize'

import { frequencyOptions } from './constants'

export function frequencyToString(
  frequency: Nullable<number>,
  defaultValue: string = 'Add auto remind'
): string {
  if (!frequency) {
    return defaultValue
  }

  return frequencyOptions[frequency]
    ? frequencyOptions[frequency]
    : `Every ${frequency} ${pluralize('Day', frequency)}`
}
