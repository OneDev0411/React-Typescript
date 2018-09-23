import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { compose, withState, pure } from 'recompose'
import Compose from '../../../../Partials/Compose'
import { hasRecipients } from '../../../../../utils/helpers'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import LeaveIcon from '../../Partials/Svgs/LeaveIcon'
import HelpIcon from '../../Partials/Svgs/HelpIcon'
import { confirmation } from '../../../../../store_actions/confirmation'
import ActionButton from '../../../../../views/components/Button/ActionButton'

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
  inline = false,
  dropDownBox = false,
  showOnly = false,
  working = false,
  /* internal props and states */
  showComposeModal,
  recipients,
  onChangeComposeModal,
  onChangeRecipients,
  OnLeaveClick,
  directRoom,
  confirmation,
  roomUsers
}) => (
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
        <Modal.Title>{title}</Modal.Title>
        {OnLeaveClick && (
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="popover-leave">
                {directRoom ? 'Archive chat' : 'Leave chat'}
              </Tooltip>
            }
          >
            <span
              className=" leave-icon"
              onClick={() =>
                confirmation({
                  message: directRoom
                    ? 'Archive this chat?'
                    : 'Leave this chat?',
                  description: directRoom
                    ? 'This chatroom will reappear in your inbox' +
                      ' if you receive a message.'
                    : 'You will no longer receive messages or notifications' +
                      ' from this chatroom once you leave.',
                  confirmLabel: directRoom ? 'Yes, archive' : 'Yes, leave',
                  onConfirm: () => OnLeaveClick()
                })
              }
            >
              <LeaveIcon />
            </span>
          </OverlayTrigger>
        )}
        {directRoom && (
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="popover-leave">
                You cannot add members to a direct message room
              </Tooltip>
            }
          >
            <span className=" leave-icon">
              <HelpIcon />
            </span>
          </OverlayTrigger>
        )}
      </Modal.Header>

      <Modal.Body>
        {!showOnly && (
          <Compose
            dropDownBox={dropDownBox}
            onChangeRecipients={recipients => onChangeRecipients(recipients)}
            roomUsers={roomUsers}
          />
        )}

        {InitialValues && <InitialValues />}
      </Modal.Body>

      {!showOnly && (
        <Modal.Footer>
          <ActionButton
            disabled={working || !hasRecipients(recipients)}
            onClick={async () => {
              await onButtonClick(recipients)
              // reset states
              onChangeComposeModal(false)
              onChangeRecipients({})
            }}
          >
            {buttonTitle}
          </ActionButton>
        </Modal.Footer>
      )}
    </Modal>
  </div>
)
export default connect(
  null,
  {
    confirmation
  }
)(enhance(ComposeWrapper))
