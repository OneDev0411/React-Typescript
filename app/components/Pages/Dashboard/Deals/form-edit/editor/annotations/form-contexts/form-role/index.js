import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import _ from 'underscore'

import ContextAnnotation from '../context-annotation'
import { getRoleText } from '../../../../utils/get-roles-text'

function FormRole(props) {
  if (!props.roles) {
    return false
  }

  return (
    <Fragment>
      {_.map(props.roles, (list, roleName) => {
        const info = props.roles[roleName]
        const groups = _.groupBy(info, 'group')

        return _.map(groups, (group, groupIndex) => {
          const annotationContext = groups[groupIndex][0]

          const text = getRoleText(
            props.dealsRoles,
            props.deal,
            roleName,
            annotationContext
          )
          const annotations = groups[groupIndex].map(info => info.annotation)

          return (
            <ContextAnnotation
              key={`${roleName}-${groupIndex}`}
              annotationContext={annotationContext}
              annotations={annotations}
              value={text}
              maxFontSize={20}
              isReadOnly={annotationContext.readonly === true}
              onClick={() =>
                annotationContext.readonly !== true &&
                props.onClick('Role', {
                  contextType: 'Role',
                  annotations,
                  annotationContext,
                  roleName
                })
              }
              onSetValues={props.onSetValues}
            />
          )
        })
      })}
    </Fragment>
  )
}

function mapStateToProps({ deals }) {
  return {
    dealsRoles: deals.roles
  }
}

export default connect(mapStateToProps)(FormRole)
