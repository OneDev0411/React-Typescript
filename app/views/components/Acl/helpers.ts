import { hasUserAccess } from 'utils/acl'

import { Access, AccountInfo } from './types'

export function hasAccess(accountInfo: AccountInfo, requiredAccess: Access) {
  if (typeof requiredAccess === 'function') {
    return requiredAccess(accountInfo)
  }

  if (typeof requiredAccess === 'string') {
    return hasUserAccess(accountInfo.team, requiredAccess)
  }

  if (requiredAccess.oneOf) {
    return ([] as Access[])
      .concat(requiredAccess.oneOf)
      .some(accessItem => hasAccess(accountInfo, accessItem))
  }
}
