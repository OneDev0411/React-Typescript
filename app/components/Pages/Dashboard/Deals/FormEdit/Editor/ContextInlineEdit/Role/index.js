import React from 'react'
import { connect } from 'react-redux'

import { selectDealRoles } from 'reducers/deals/roles'
import ActionButton from 'components/Button/ActionButton'

import RoleCrmIntegration from '../../../../components/Roles/CrmIntegration'

import { normalizeRoleNames } from '../../../utils/get-roles-text'
import { getLegalFullName, roleName } from '../../../../utils/roles'

function RolesEdit(props) {
  const getAllowedRoles = () => normalizeRoleNames(props.deal, props.roleName)

  const allowedRoles = getAllowedRoles()

  const roles = props.roles.filter(user => allowedRoles.includes(user.role))

  return (
    <RoleCrmIntegration
      isOpen
      deal={props.deal}
      role={roles[props.roleIndex]}
      // isRoleRemovable={isRowRemovable}
      allowedRoles={allowedRoles}
      onHide={props.onClose}
    />
  )
}

function mapStateToProps({ deals }, props) {
  return {
    roles: selectDealRoles(deals.roles, props.deal)
  }
}

export default connect(mapStateToProps)(RolesEdit)
