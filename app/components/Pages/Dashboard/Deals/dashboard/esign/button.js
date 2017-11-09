import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, MenuItem, Button } from 'react-bootstrap'
import { batchActions } from 'redux-batched-actions'
import FileSvg from '../../../Partials/Svgs/File'
import MultipleFileSvg from '../../../Partials/Svgs/MultipleFile'
import { showCompose, showAttachments, updateAttachments } from '../../../../../../store_actions/deals'

const EsignButton = ({
  dealId,
  task,
  attachments = [],
  showAttachments,
  showCompose,
  updateAttachments
}) => {
  const formIsCompleted = task.submission && task.submission.state === 'Fair'

  const onSingleClick = () => {
    batchActions([
      updateAttachments(attachments),
      showCompose()
    ])
  }

  const onMultipleClick = () => {
    batchActions([
      updateAttachments(attachments),
      showAttachments()
    ])
  }

  return (
    <div className="inline">
      <Dropdown
        id="drp-send-esign"
        className="deal-esgin-cta-menu"
        pullRight
      >

        <Button
          bsRole="toggle"
          className="btn-deal deal-esgin-cta-btn"
        >
          Get Signatures
        </Button>

        <Dropdown.Menu>
          {
            formIsCompleted &&
            <MenuItem
              onClick={onSingleClick}
              eventKey="1"
            >
              <FileSvg />
              Send this file
            </MenuItem>
          }

          {
            formIsCompleted &&
            <MenuItem divider />
          }

          <MenuItem
            onClick={onMultipleClick}
            eventKey="2"
          >
            <MultipleFileSvg />
            Send multiple files
          </MenuItem>

        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default connect(null,
  { showCompose, showAttachments, updateAttachments })(EsignButton)
