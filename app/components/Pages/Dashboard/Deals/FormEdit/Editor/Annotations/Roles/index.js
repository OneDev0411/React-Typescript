import React from 'react'
import { connect } from 'react-redux'

import { selectDealRoles } from 'reducers/deals/roles'

import {
  getRoleText,
  normalizeRoleNames
} from 'deals/FormEdit/utils/get-roles-text'
import { getGroupValues } from 'deals/FormEdit/utils/get-group-values'
import { getAnnotationsByType } from 'deals/FormEdit/utils/get-annotations-by-type'

import { AnnotationWrapper } from '../components/AnnotationWrapper'
import { RoleField } from './RoleField'

function Roles(props) {
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
        props.roles,
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

function mapStateToProps({ deals }, props) {
  return {
    roles: selectDealRoles(deals.roles, props.deal)
  }
}

export default connect(mapStateToProps)(Roles)
