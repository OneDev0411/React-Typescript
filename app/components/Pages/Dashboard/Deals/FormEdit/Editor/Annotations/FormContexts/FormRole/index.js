import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import _ from 'underscore'

import ContextAnnotation from '../ContextAnnotation'
import { getRoleText } from '../../../../utils/get-roles-text'
import { getRoleTooltip } from '../../../../utils/get-role-tooltip'

class FormRole extends React.PureComponent {
  state = {
    roles: []
  }

  componentDidMount() {
    this.initialize()
  }

  initialize = () => {
    const roles = []

    if (!this.props.roles) {
      return false
    }

    _.each(this.props.roles, (list, roleName) => {
      const info = this.props.roles[roleName]
      const groups = _.groupBy(
        info,
        item => `${item.role.sort().join('_')}-${item.attribute}-${item.group}`
      )

      _.each(groups, (group, groupIndex) => {
        const annotationContext = groups[groupIndex][0]
        const annotations = groups[groupIndex].map(info => info.annotation)

        const formValue = this.props.formValues[
          annotationContext.annotation.fieldName
        ]

        const text =
          formValue ||
          getRoleText(
            this.props.dealsRoles,
            this.props.deal,
            roleName,
            annotationContext
          )

        roles.push({
          contextType: 'Role',
          groupIndex,
          roleName,
          annotations,
          annotationContext,
          text
        })
      })
    })

    this.setState({
      roles
    })
  }

  render() {
    return (
      <Fragment>
        {this.state.roles.map(item => (
          <ContextAnnotation
            key={`${item.roleName}-${item.groupIndex}`}
            annotationContext={item.annotationContext}
            annotations={item.annotations}
            value={item.text}
            maxFontSize={20}
            isReadOnly={item.annotationContext.readonly === true}
            tooltip={getRoleTooltip(item.annotationContext)}
            onClick={bounds =>
              item.annotationContext.readonly !== true &&
              this.props.onClick('Role', {
                bounds,
                ...item
              })
            }
            onSetValues={this.props.onSetValues}
          />
        ))}
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
