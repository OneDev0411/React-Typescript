import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import ContextAnnotation from '../context-annotation'
import { getRolesText } from '../../../../utils/get-roles-text'

class FormRoles extends React.PureComponent {
  render() {
    return (
      <Fragment>
        {_.map(this.props.roles, (list, roleName) => {
          const info = this.props.roles[roleName]
          const groups = _.groupBy(info, 'group')

          return _.map(groups, (group, groupIndex) => {
            const annotationContext = groups[groupIndex][0]
            const annotations = groups[groupIndex].map(info => info.annotation)

            const text = getRolesText(
              this.props.dealsRoles,
              this.props.deal,
              roleName,
              annotationContext
            )

            return (
              <ContextAnnotation
                key={`${roleName}-${groupIndex}`}
                annotationContext={annotationContext}
                annotations={annotations}
                value={text}
                maxFontSize={20}
                readOnly={annotationContext.isReadOnly}
                onClick={() =>
                  annotationContext.readonly !== true &&
                  this.props.onClick('Role', {
                    contextType: 'Roles',
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

export default connect(mapStateToProps)(FormRoles)
