import React from 'react'
import { connect } from 'react-redux'

import { selectDealRoles } from 'reducers/deals/roles'
import { getRoleText } from 'deals/FormEdit/utils/get-roles-text'
import { normalizeRoleNames } from 'deals/FormEdit/utils/normalize-role-names'

import { getGroupValues } from 'deals/FormEdit/utils/get-group-values'
import { getAnnotationsByType } from 'deals/FormEdit/utils/get-annotations-by-type'

import { AnnotationWrapper } from '../components/AnnotationWrapper'
import { RoleField } from './RoleField'

export function Roles(props) {
  const handleChangeRoles = form => {
    let fields = {}

    const list = getAnnotationsByType(props.annotations, 'roles')

    list.forEach(group => {
      if (
        normalizeRoleNames(props.deal, group[0].role).includes(form.role) ===
        false
      ) {
        return false
      }

      const roleText = getRoleText(
        getAllRoles(props.roles, form),
        props.deal,
        group[0].role,
        group[0]
      )

      fields = {
        ...fields,
        ...getGroupValues(group, roleText)
      }
    })

    props.onValueUpdate(fields)
  }

  return (
    <AnnotationWrapper
      items={props.annotations[props.pageIndex].roles}
      values={props.values}
      render={inputProps => (
        <RoleField
          deal={props.deal}
          roles={props.roles}
          onUpsertRole={handleChangeRoles}
          onDeleteRole={handleChangeRoles}
          {...inputProps}
        />
      )}
    />
  )
}

function getAllRoles(roles, form) {
  if (!Array.isArray(roles)) {
    return []
  }

  const roleExists = roles.some(role => role.id === form.id)

  if (roleExists) {
    return roles.map(role => (role.id === form.id ? form : role))
  }

  return [...roles, form]
}

function mapStateToProps({ deals }, props) {
  return {
    roles: selectDealRoles(deals.roles, props.deal)
  }
}

export default connect(mapStateToProps)(Roles)
