import { hasUserAccess } from 'utils/acl'

import { Access } from './types'

export function hasAccess(team: IUserTeam, requiredAccess: Access) {
  if (typeof requiredAccess === 'function') {
    return requiredAccess(team)
  }

  if (typeof requiredAccess === 'string') {
    return hasUserAccess(team, requiredAccess)
  }

  if (requiredAccess.oneOf) {
    return ([] as Access[])
      .concat(requiredAccess.oneOf)
      .some(accessItem => hasAccess(team, accessItem))
  }
}
