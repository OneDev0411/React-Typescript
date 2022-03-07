import { IImpersonateUserState } from '@app/reducers/user/impersonate-user'
import { GOOGLE_CREDENTIAL } from 'constants/oauth-accounts'

import { EmailFormValues } from '../types'

interface GetInitialValuesParams {
  allAccounts: IOAuthAccount[]
  defaultUser: IUser
  impersonateUser?: IImpersonateUserState
  defaultValues?: Partial<EmailFormValues>
  preferredAccountId?: UUID
}

export const getInitialValues = ({
  allAccounts,
  defaultUser,
  impersonateUser = null,
  defaultValues = {},
  preferredAccountId = ''
}: GetInitialValuesParams): Partial<EmailFormValues> => {
  let from = defaultValues.from

  if (preferredAccountId && from && from.type !== 'user') {
    from = allAccounts.find(({ id }) => id === preferredAccountId) || from
  }

  from =
    from ??
    impersonateUser ??
    allAccounts.find(({ type }) => type === GOOGLE_CREDENTIAL) ??
    allAccounts[0] ??
    defaultUser

  return {
    ...defaultValues,
    from
  }
}
