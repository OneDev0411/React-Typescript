import { EmailFormValues } from '../../types'

export function emailFromToValue(from: EmailFormValues['from']): string {
  if (typeof from === 'string') {
    return from
  }

  return from ? from.id : ''
}
