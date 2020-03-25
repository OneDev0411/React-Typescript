import { EmailFormValues } from '../types'
import { hasSelectedAccount } from './has-selected-account'
import { getDefaultSelectedAccount } from './get-default-selected-account'

// If no account is selected and there are more than one account, we set
// one account by default to push user use one of their accounts for
// sending emails instead of using out default solution (Mailgun) for
// sending emails.
export const getInitialValues = (
  allAccounts: IOAuthAccount[],
  preferredAccountId: UUID = '',
  initialValues: Partial<EmailFormValues> = {}
): Partial<EmailFormValues> => {
  return allAccounts.length > 0 && !hasSelectedAccount(initialValues)
    ? {
        ...initialValues,
        ...getDefaultSelectedAccount(allAccounts, preferredAccountId)
      }
    : initialValues
}
