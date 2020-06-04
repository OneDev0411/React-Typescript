import { EmailFormValues } from '../types'

export function getDefaultSelectedAccount(
  allAccounts: (IOAuthAccount)[],
  preferredAccountId: UUID
): Pick<EmailFormValues, 'microsoft_credential' | 'google_credential'> {
  const account =
    allAccounts.find(
      account => !preferredAccountId || account.id === preferredAccountId
    ) || allAccounts[0]

  return account
    ? {
        microsoft_credential:
          account.type === 'microsoft_credential' ? account.id : undefined,
        google_credential:
          account.type === 'google_credential' ? account.id : undefined
      }
    : {}
}
