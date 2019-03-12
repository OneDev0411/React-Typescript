import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import _ from 'underscore'

import ContextAnnotation from '../ContextAnnotation'
import { getRoleText } from '../../../../utils/get-roles-text'
import { getRoleTooltip } from '../../../../utils/get-role-tooltip'

class FormRole extends React.PureComponent {
  render() {
    if (!this.props.roles) {
      return false
    }

    return (
      <Fragment>
        {_.map(this.props.roles, (list, roleName) => {
          const info = this.props.roles[roleName]
          const groups = _.groupBy(
            info,
            item =>
              `${item.role.sort().join('_')}-${item.attribute}-${item.group}`
          )

          return _.map(groups, (group, groupIndex) => {
            const annotationContext = groups[groupIndex][0]
            const formValue = this.props.formValues[
              annotationContext.annotation.fieldName
            ]

            const text =
              typeof formValue === 'string'
                ? formValue
                : getRoleText(
                    this.props.dealsRoles,
                    this.props.deal,
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
                tooltip={getRoleTooltip(annotationContext)}
                onClick={() =>
                  annotationContext.readonly !== true &&
                  this.props.onClick('Role', {
                    contextType: 'Role',
                    annotations,
                    annotationContext,
                    roleName
                  })
                }
                onSetValues={this.props.onSetValues}
              />
            )
          })
        })}
      </Fragment>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    dealsRoles: deals.roles
  }
}

export default connect(mapStateToProps)(FormRole)
