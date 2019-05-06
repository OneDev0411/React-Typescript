import React, { Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import ContextAnnotation from '../ContextAnnotation'
import { getRolesText } from '../../../../utils/get-roles-text'
import { getRoleTooltip } from '../../../../utils/get-role-tooltip'

const FormRoles = React.memo(props => {
  const [roles, setRoles] = useState([])

  useEffect(() => {
    const roles = []

    _.each(props.roles, (list, roleName) => {
      const info = props.roles[roleName]
      const groups = _.groupBy(
        info,
        item => `${item.role.sort().join('_')}-${item.attribute}-${item.group}`
      )

      _.each(groups, (group, groupIndex) => {
        const annotationContext = groups[groupIndex][0]
        const annotations = groups[groupIndex].map(info => info.annotation)
        const formValue =
          props.formValues[annotationContext.annotation.fieldName]

        const text =
          formValue ||
          getRolesText(
            props.dealsRoles,
            props.deal,
            roleName,
            annotationContext
          )

        roles.push({
          contextType: 'Roles',
          groupIndex,
          roleName,
          annotations,
          annotationContext,
          text
        })
      })
    })

    setRoles(roles)
    // eslint-disable-next-line
  }, [])

  return (
    <Fragment>
      {roles.map(item => (
        <ContextAnnotation
          key={`${item.roleName}-${item.groupIndex}`}
          annotationContext={item.annotationContext}
          annotations={item.annotations}
          value={item.text}
          maxFontSize={20}
          readOnly={item.annotationContext.isReadOnly}
          tooltip={getRoleTooltip(item.annotationContext, true)}
          onClick={bounds =>
            item.annotationContext.readonly !== true &&
            props.onClick('Role', {
              bounds,
              ...item
            })
          }
          onSetValues={props.onSetValues}
        />
      ))}
    </Fragment>
  )
})

function mapStateToProps({ deals }) {
  return {
    dealsRoles: deals.roles
  }
}

export default connect(mapStateToProps)(FormRoles)
