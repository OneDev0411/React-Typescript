import React from 'react'
import Roles from '../roles'

import OverlayDrawer from 'components/OverlayDrawer'

export default ({ show, deal, onHide, allowedRoles, onAddRecipient }) => (
  <OverlayDrawer isOpen={show} onClose={onHide} showFooter={false}>
    <OverlayDrawer.Header title="Add a Signer" />

    <OverlayDrawer.Body>
      <div className="c-add-signer-modal">
        <Roles
          deal={deal}
          isEmailRequired
          allowDeleteRole={false}
          // allowedRoles={allowedRoles}
          onSelect={onAddRecipient}
        />
      </div>
    </OverlayDrawer.Body>
  </OverlayDrawer>
)
