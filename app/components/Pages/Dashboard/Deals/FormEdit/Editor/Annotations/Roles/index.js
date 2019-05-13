import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { selectDealRoles } from 'reducers/deals/roles'

import { getRoleText } from '../../../utils/get-roles-text'
import { calculateWordWrap } from '../../../utils/word-wrap'

import { AnnotationWrapper } from '../components/AnnotationWrapper'
import { RoleField } from './RoleField'

const Roles = React.memo(props => {
  const handleUpsert = form => {
    const valuesList = {}

    _.each(props.annotations, page => {
      _.each(page.roles, groups => {
        _.each(groups, group => {
          if (group[0].role.includes(form.role) === false) {
            return false
          }

          const annotations = group.map(item => item.annotation)

          const roleText = getRoleText(
            props.dealRoles,
            props.deal,
            form.role,
            group[0]
          )

          const { values } = calculateWordWrap(annotations, roleText)

          group.forEach((item, index) => {
            valuesList[item.annotation.fieldName] = values[index]
          })
        })
      })
    })

    props.onValueUpdate(valuesList)
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
