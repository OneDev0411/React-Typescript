import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { compose, withState, pure } from 'recompose'
import Compose from '../../../../Partials/Compose'
import { hasRecipients } from '../../../../../utils/helpers'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import LeaveIcon from '../../Partials/Svgs/LeaveIcon'

const enhance = compose(
  pure,
  withState('showComposeModal', 'onChangeComposeModal', false),
  withState('recipients', 'onChangeRecipients', {})
)

const ComposeWrapper = ({
  TriggerButton,
  InitialValues,
  title,
  buttonTitle,
  onButtonClick,
  room = null,
  inline = false,
  dropDownBox = false,
  showOnly = false,
  working = false,
  /* internal props and states */
  showComposeModal,
  recipients,
  onChangeComposeModal,
  onChangeRecipients,
  OnLeaveClick
}) =>
  (
    <div style={{ display: inline ? 'inline' : 'block' }}>
      <TriggerButton
        clickHandler={() => onChangeComposeModal(!showComposeModal)}
      />

      <Modal
        show={showComposeModal}
        dialogClassName="chatroom-add-member"
        onHide={() => onChangeComposeModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {title}
          </Modal.Title>
          {OnLeaveClick &&
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="popover-leave">Leave chat</Tooltip>}
          >
            <span
              className=" leave-icon"
              onClick={OnLeaveClick}
            >
              <LeaveIcon />
            </span>
          </OverlayTrigger>
          }
        </Modal.Header>

        <Modal.Body>
          {!showOnly &&
          <Compose
            dropDownBox={dropDownBox}
            onChangeRecipients={recipients => onChangeRecipients(recipients)}
          />}

          {InitialValues && <InitialValues />}
        </Modal.Body>

        {!showOnly &&
        <Modal.Footer>
          <Button
            bsStyle="primary"
            disabled={working || !hasRecipients(recipients)}
            onClick={async () => {
              await onButtonClick(recipients)
              // reset states
              onChangeComposeModal(false)
              onChangeRecipients({})
            }}
          >
            {buttonTitle}
          </Button>
        </Modal.Footer>}
      </Modal>
    </div>
  )
export default enhance(ComposeWrapper)
