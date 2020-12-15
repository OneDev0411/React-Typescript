import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withProps } from 'recompose'
import { browserHistory } from 'react-router'

import { hasUserAccess } from '../../../utils/user-teams'

import { ACL } from '../../../constants/acl'

type Access = IPermission | ((user: IUser) => boolean) | { oneOf: Access[] }

interface Props {
  access: Access | Access[]
  fallback?: React.ReactNode
  children: React.ReactNode
  fallbackUrl?: string | null
  accessControlPolicy?: IAccessControlPolicy
  user: IUser
}

interface StateProps {
  user: IUser
}

/**
 * Renders children only if the current user has access to the specified
 * permissions
 * @param {(string | Function | {oneOf: AccessType})[]} one or an array of:
 * - A string
 * - An object of the form {oneOf: Access}
 * - A function of the form (user, acl) => boolean
 * @param {React.ReactNode} fallback something to be rendered if access is denied. Defaults to null
 * @param {React.ReactNode} children
 * @param user
 *
 * @example
 * ```
 * <Acl access={ACL.ADMIN}> Only admins see this</Acl>
 * <Acl access={['foo', 'bar']}>Requires both 'foo' and 'bar'</Acl>
 * <Acl access={user => user.user_type === 'Agent'}>Custom access restriction</Acl>
 * <Acl access={{oneOf: [ACL.BACK_OFFICE, ACL.DEAL]}}>Agent or BackOffice</Acl>
 * ```
 */
function Acl({
  access,
  fallback = null,
  fallbackUrl = null,
  accessControlPolicy,
  children,
  user
}: Props) {
  const userHasAccess = ([] as Access[]).concat(access).every(hasAccess)

  useEffect(() => {
    if (!userHasAccess && fallbackUrl) {
      browserHistory.push('/dashboard/mls')
    }
    // eslint-disable-next-line
  }, [])

  return <>{userHasAccess ? children : fallback}</>

  function hasAccess(requiredAccess: Access) {
    if (typeof requiredAccess === 'function') {
      return requiredAccess(user)
    }

    if (typeof requiredAccess === 'string') {
      return hasUserAccess(user, requiredAccess, accessControlPolicy)
    }

    if (requiredAccess.oneOf) {
      return ([] as Access[]).concat(requiredAccess.oneOf).some(hasAccess)
    }
  }
}

const ConnectedAcl = connect(({ user }: StateProps) => ({
  user
}))(Acl)

export default Object.assign(ConnectedAcl, {
  Crm: withProps<Pick<Props, 'access'>, {}>({ access: [ACL.CRM] })(
    ConnectedAcl
  ),
  Admin: withProps<Pick<Props, 'access'>, {}>({ access: [ACL.ADMIN] })(
    ConnectedAcl
  ),
  BackOffice: withProps<Pick<Props, 'access'>, {}>({
    access: [ACL.BACK_OFFICE]
  })(ConnectedAcl),
  Deals: withProps<Pick<Props, 'access'>, {}>({ access: [ACL.DEALS] })(
    ConnectedAcl
  ),
  Marketing: withProps<Pick<Props, 'access'>, {}>({ access: [ACL.MARKETING] })(
    ConnectedAcl
  ),
  AgentNetwork: withProps<Pick<Props, 'access'>, {}>({
    access: [ACL.AGENT_NETWORK]
  })(ConnectedAcl)
})
