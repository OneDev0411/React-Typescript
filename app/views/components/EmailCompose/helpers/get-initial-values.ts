import { GOOGLE_CREDENTIAL } from 'constants/oauth-accounts'

import { EmailFormValues } from '../types'

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
  let from = defaultValues.from

  if (preferredAccountId && from && from.type !== 'user') {
    from = allAccounts.find(({ id }) => id === preferredAccountId) || from
  }

  from =
    from ??
    allAccounts.find(({ type }) => type === GOOGLE_CREDENTIAL) ??
    allAccounts[0] ??
    defaultUser

  return {
    ...defaultValues,
    from
  }
}
