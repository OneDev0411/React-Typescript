import React from 'react'
import { useSelector } from 'react-redux'

import { selectDealRoles } from 'reducers/deals/roles'
import { getRoleText } from 'deals/FormEdit/utils/get-roles-text'
import { normalizeRoleNames } from 'deals/FormEdit/utils/normalize-role-names'

import { getGroupValues } from 'deals/FormEdit/utils/get-group-values'
import { getAnnotationsByType } from 'deals/FormEdit/utils/get-annotations-by-type'

import { AnnotationWrapper } from '../components/AnnotationWrapper'
import { RoleField } from './RoleField'

export function Roles(props) {
  const roles = useSelector(({ deals }) => {
    return selectDealRoles(deals.roles, props.deal)
  })

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
        getAllRoles(roles, form),
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
          roles={roles}
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

  if (form.deleted) {
    return roles.filter(role => role.id !== form.id)
  }

  const roleExists = roles.some(role => role.id === form.id)

  if (roleExists) {
    return roles.map(role => (role.id === form.id ? form : role))
  }

  return [...roles, form]
}

export default Roles
