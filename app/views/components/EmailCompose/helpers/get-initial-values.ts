import {
  GOOGLE_CREDENTIAL,
  MICROSOFT_CREDENTIAL
} from 'constants/oauth-accounts'

import { EmailFormValues } from '../types'
import { getDefaultSelectedAccount } from './get-default-selected-account'

interface GetInitialValuesParams {
  allAccounts: IOAuthAccount[]
  defaultValues?: Partial<EmailFormValues>
  defaultUser: IUser
  preferredAccountId?: UUID
}

export const getInitialValues = ({
  allAccounts,
  defaultValues = {},
  defaultUser,
  preferredAccountId = ''
}: GetInitialValuesParams): Partial<EmailFormValues> => {
  let from: IUser | IOAuthAccount =
    (defaultValues && defaultValues.from) || defaultUser

  if (
    allAccounts.length > 0 &&
    [GOOGLE_CREDENTIAL, MICROSOFT_CREDENTIAL].includes(from.type)
  ) {
    from = getDefaultSelectedAccount(
      allAccounts,
      preferredAccountId || (defaultValues?.from?.id ?? '')
    )
  }

  return {
    ...defaultValues,
    from
  }
}
