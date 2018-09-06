import React from 'react'
import OverlayDrawer from '../../../../../../../../views/components/OverlayDrawer'

import Roles from '../../../../dashboard/roles'

export default class RolesDrawer extends React.Component {
  render() {
    return (
      <OverlayDrawer isOpen={this.props.isOpen} onClose={this.props.onClose}>
        <OverlayDrawer.Header title="Contacts" />
        <OverlayDrawer.Body>
          <Roles deal={this.props.deal} allowDeleteRole />
        </OverlayDrawer.Body>
        <OverlayDrawer.Footer>Foot</OverlayDrawer.Footer>
      </OverlayDrawer>
    )
  }
}
