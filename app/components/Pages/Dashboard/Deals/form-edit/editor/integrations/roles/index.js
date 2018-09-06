import React from 'react'
import OverlayDrawer from '../../../../../../../../views/components/OverlayDrawer'

import Roles from '../../../../components/roles'

export default class RolesDrawer extends React.Component {
  render() {
    return (
      <OverlayDrawer
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
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
