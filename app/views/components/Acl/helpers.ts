import { hasUserAccess } from 'utils/user-teams'

import { Access } from './types'

export function hasAccess(
  user: IUser,
  requiredAccess: Access,
  accessControlPolicy?: IAccessControlPolicy
) {
  if (typeof requiredAccess === 'function') {
    return requiredAccess(user)
  }

  if (typeof requiredAccess === 'string') {
    return hasUserAccess(user, requiredAccess, accessControlPolicy)
  }

  if (requiredAccess.oneOf) {
    return ([] as Access[])
      .concat(requiredAccess.oneOf)
      .some(accessItem => hasAccess(user, accessItem, accessControlPolicy))
  }
}
