import { useEffect } from 'react'
import { connect } from 'react-redux'
import { withProps } from 'recompose'
import { browserHistory } from 'react-router'

import PropTypes from 'prop-types'

import { getActiveTeamACL } from '../../../utils/user-teams'

import { ACL } from '../../../constants/acl'

interface Props {
  access: string | string[]
  fallback: React.ReactNode
  children: React.ReactNode
  fallbackUrl: string | null
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
  children,
  user
}: Props) {
  const acl = user ? getActiveTeamACL(user) : []
  const userHasAccess = ([] as string[]).concat(access).every(hasAccess)

  useEffect(() => {
    if (!userHasAccess && fallbackUrl) {
      browserHistory.push('/dashboard/mls')
    }
    // eslint-disable-next-line
  }, [])

  return userHasAccess ? children : fallback

  function hasAccess(requiredAccess) {
    if (typeof requiredAccess === 'function') {
      return requiredAccess(user, acl)
    }

    if (requiredAccess.oneOf) {
      return [].concat(requiredAccess.oneOf).some(hasAccess)
    }

    return acl.includes(requiredAccess)
  }
}

const ConnectedAcl = connect<StateProps, null, Props>(
  ({ user }: StateProps) => ({
    user
  })
)(Acl)

const AccessType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    oneOf: PropTypes.arrayOf(PropTypes.string)
  }),
  PropTypes.func
])

ConnectedAcl.propTypes = {
  fallback: PropTypes.node,
  children: PropTypes.node.isRequired,
  access: PropTypes.oneOfType([PropTypes.arrayOf(AccessType), AccessType])
    .isRequired
}

export default Object.assign(ConnectedAcl, {
  Crm: withProps({ access: [ACL.CRM] })(ConnectedAcl),
  Admin: withProps({ access: [ACL.ADMIN] })(ConnectedAcl),
  BackOffice: withProps({ access: [ACL.BACK_OFFICE] })(ConnectedAcl),
  Deals: withProps({ access: [ACL.DEALS] })(ConnectedAcl),
  Marketing: withProps({ access: [ACL.MARKETING] })(ConnectedAcl)
})
