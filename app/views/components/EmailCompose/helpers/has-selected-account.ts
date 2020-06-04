import { EmailFormValues } from '../types'

export function hasSelectedAccount(values: Partial<EmailFormValues>): boolean {
  return Boolean(values.microsoft_credential || values.google_credential)
}
