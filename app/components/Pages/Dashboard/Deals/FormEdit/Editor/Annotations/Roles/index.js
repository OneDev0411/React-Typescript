import React from 'react'
import { connect } from 'react-redux'

import { selectDealRoles } from 'reducers/deals/roles'

import { getRoleText } from '../../../utils/get-roles-text'
import { getGroupValues } from '../../../utils/get-group-values'
import { getAnnotationsByType } from '../../../utils/get-annotations-by-type'

import { AnnotationWrapper } from '../components/AnnotationWrapper'
import { RoleField } from './RoleField'

const Roles = React.memo(props => {
  const handleUpsert = form => {
    let fields = {}

    const list = getAnnotationsByType(props.annotations, 'roles')

    list.forEach(group => {
      if (group[0].role.includes(form.role) === false) {
        return false
      }

      const roleText = getRoleText(
        props.dealRoles,
        props.deal,
        form.role,
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
      getValue={(roleName, annotation) =>
        getRoleText(props.dealRoles, props.deal, roleName, annotation)
      }
      render={inputProps => (
        <RoleField
          deal={props.deal}
          roles={props.dealRoles}
          onUpsertRole={handleUpsert}
          {...inputProps}
        />
      )}
    />
  )
})

function mapStateToProps({ deals }, props) {
  return {
    dealRoles: selectDealRoles(deals.roles, props.deal)
  }
}

export default connect(mapStateToProps)(Roles)
