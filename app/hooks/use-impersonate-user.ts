import { useSelector } from 'react-redux'

import { selectImpersonateUser } from '@app/selectors/user'

export function useImpersonateUser(): ReturnType<typeof selectImpersonateUser> {
  const impersonateUser = useSelector(selectImpersonateUser)

  return impersonateUser
}
