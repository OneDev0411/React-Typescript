import { EmailFormValues } from '../../types'

export function emailFromToDisplayValue(from: EmailFormValues['from']): string {
  if (typeof from === 'string') {
    return from
  }

  return from ? `${from.display_name} <${from.email}>` : ' - '
}
