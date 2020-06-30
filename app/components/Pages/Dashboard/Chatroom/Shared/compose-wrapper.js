import React from 'react'
import { connect } from 'react-redux'
import { compose, withState, pure } from 'recompose'

import Compose from '../../../../Partials/Compose'
import { hasRecipients } from '../../../../../utils/helpers'
import LeaveIcon from '../../Partials/Svgs/LeaveIcon'
import HelpIcon from '../../Partials/Svgs/HelpIcon'
import CloseIcon from '../../Partials/Svgs/CloseIcon'
import { confirmation } from '../../../../../store_actions/confirmation'
import {
  Modal,
  ModalHeader,
  ModalFooter
} from '../../../../../views/components/Modal'
import ActionButton from '../../../../../views/components/Button/ActionButton'
import Tooltip from '../../../../../views/components/tooltip'

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
      isOpen={showComposeModal}
      className="chatroom-add-member"
      autoHeight
      onRequestClose={() => onChangeComposeModal(false)}
    >
      <ModalHeader title={title} className="modal-header">
        {OnLeaveClick && (
          <Tooltip
            placement="bottom"
            caption={directRoom ? 'Archive chat' : 'Leave chat'}
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
          </Tooltip>
        )}
        {directRoom && (
          <Tooltip
            placement="bottom"
            caption="You cannot add members to a direct message room"
          >
            <span className=" leave-icon">
              <HelpIcon />
            </span>
          </Tooltip>
        )}
        <Tooltip placement="bottom" caption="Close">
          <span
            className=" close"
            onClick={() => onChangeComposeModal(!showComposeModal)}
          >
            <CloseIcon width={14} height={14} />
          </span>
        </Tooltip>
      </ModalHeader>

      <div>
        {!showOnly && (
          <Compose
            dropDownBox={dropDownBox}
            onChangeRecipients={recipients => onChangeRecipients(recipients)}
            roomUsers={roomUsers}
          />
        )}

        {InitialValues && <InitialValues />}
      </div>

      {!showOnly && (
        <ModalFooter>
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
        </ModalFooter>
      )}
    </Modal>
  </div>
)
export default connect(null, {
  confirmation
})(enhance(ComposeWrapper))
