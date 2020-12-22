import React from 'react'
import { useSelector } from 'react-redux'
import { withProps } from 'recompose'
import { browserHistory } from 'react-router'

import { selectUserHasAccess } from 'selectors/acl'
import { IAppState } from 'reducers'

import { ACL } from '../../../constants/acl'

import { Access } from './types'

interface Props {
  access: Access | Access[]
  fallback?: React.ReactNode
  children: React.ReactNode
  fallbackUrl?: string | null
  accessControlPolicy?: IAccessControlPolicy
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
  children
}: Props) {
  const userHasAccess = useSelector((state: IAppState) =>
    selectUserHasAccess(state, access, accessControlPolicy)
  )

  if (!userHasAccess && fallbackUrl) {
    browserHistory.push('/dashboard/mls')
  }

  return <>{userHasAccess ? children : fallback}</>
}

export default Object.assign(Acl, {
  Crm: withProps<Pick<Props, 'access'>, {}>({ access: [ACL.CRM] })(Acl),
  Admin: withProps<Pick<Props, 'access'>, {}>({ access: [ACL.ADMIN] })(Acl),
  BackOffice: withProps<Pick<Props, 'access'>, {}>({
    access: [ACL.BACK_OFFICE]
  })(Acl),
  Deals: withProps<Pick<Props, 'access'>, {}>({ access: [ACL.DEALS] })(Acl),
  Marketing: withProps<Pick<Props, 'access'>, {}>({ access: [ACL.MARKETING] })(
    Acl
  ),
  AgentNetwork: withProps<Pick<Props, 'access'>, {}>({
    access: [ACL.AGENT_NETWORK]
  })(Acl)
})
