import pluralize from 'pluralize'

export const frequencyOptions = {
  7: 'Weekly',
  30: 'Monthly',
  60: 'Bimonthly',
  90: 'Quarterly',
  180: 'Semiannually',
  365: 'Annually'
}

export function frequencyToString(
  frequency: Nullable<number>,
  defaultValue: string = 'Manage Relationship'
): string {
  if (!frequency) {
    return defaultValue
  }

  return frequencyOptions[frequency]
    ? frequencyOptions[frequency]
    : `Every ${frequency} ${pluralize('Day', frequency)}`
}
