import React from 'react'
import { connect } from 'react-redux'

import OverlayDrawer from '../../../../../../../../views/components/OverlayDrawer'

import Roles from '../../../../components/roles'
import { getRolesText, getRoleText } from '../../../utils/get-roles-text'
import { getAnnotationsValues } from '../../../utils/word-wrap'

class RolesDrawer extends React.Component {
  onClose = () => {
    const { data } = this.props.selectedAnnotation
    const { roleName, annotations, annotationContext, contextType } = data

    let text = ''

    if (contextType === 'Roles') {
      text = getRolesText(
        this.props.dealsRoles,
        this.props.deal,
        roleName,
        annotationContext
      )
    }

    if (contextType === 'Role') {
      text = getRoleText(
        this.props.dealsRoles,
        this.props.deal,
        roleName,
        annotationContext
      )
    }

    const values = getAnnotationsValues(annotations, text, {
      maxFontSize: 20
    })

    this.props.onSetValues(values)
    this.props.onClose()
  }

  render() {
    return (
      <OverlayDrawer
        isOpen={this.props.isOpen}
        onClose={this.onClose}
        showFooter={false}
      >
        <OverlayDrawer.Header title="Contacts" />
        <OverlayDrawer.Body>
          <Roles
            showTitle={false}
            deal={this.props.deal}
            containerStyle={{ padding: '1rem' }}
            allowDeleteRole
          />
        </OverlayDrawer.Body>
      </OverlayDrawer>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    dealsRoles: deals.roles
  }
}

export default connect(mapStateToProps)(RolesDrawer)
