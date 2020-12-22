import { IAppState } from 'reducers'
import { selectUserUnsafe } from 'selectors/user'
import { hasAccess } from 'components/Acl/helpers'
import { Access } from 'components/Acl/types'

export const selectUserHasAccess = (
  state: IAppState,
  requiredAccess: Access | Access[],
  accessControlPolicy?: IAccessControlPolicy
): boolean => {
  const user = selectUserUnsafe(state)

  if (!user) {
    return false
  }

  const userHasNeededAccess = ([] as Access[])
    .concat(requiredAccess)
    .every(accessItem => hasAccess(user, accessItem, accessControlPolicy))

  return userHasNeededAccess
}
