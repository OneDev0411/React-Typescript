import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, MenuItem, Button } from 'react-bootstrap'
import { showAttachments, updateAttachments } from '../../../../../../store_actions/deals'

const EsignButton = ({
  dealId,
  attachments = [],
  showAttachments,
  updateAttachments
}) => (
  <div className="inline">
    <Dropdown id="drp-send-esign" pullRight>

      <Button bsRole="toggle" className="btn-deal">
        eSign
      </Button>

      <Dropdown.Menu>
        <MenuItem
          onClick={() => updateAttachments(attachments)}
          eventKey="1"
        >
          Send this file
        </MenuItem>

        <MenuItem divider />

        <MenuItem
          onClick={() => showAttachments(attachments)}
          eventKey="2"
        >
          Send multiple files
        </MenuItem>

      </Dropdown.Menu>
    </Dropdown>
  </div>
)

export default connect(null,
  { showAttachments, updateAttachments })(EsignButton)
