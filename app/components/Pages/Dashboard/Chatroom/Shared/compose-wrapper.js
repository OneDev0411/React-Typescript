import React from 'react'
import { connect } from 'react-redux'
import { compose, withState, pure } from 'recompose'
import { mdiLogout, mdiHelpCircleOutline, mdiClose } from '@mdi/js'
import { Tooltip, Button } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import Compose from '../../../../Partials/Compose'
import { hasRecipients } from '../../../../../utils/helpers'
import { confirmation } from '../../../../../store_actions/confirmation'
import {
  Modal,
  ModalHeader,
  ModalFooter
} from '../../../../../views/components/Modal'

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
          <Tooltip title={directRoom ? 'Archive chat' : 'Leave chat'}>
            <span
              className="modal-action-button"
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
              <SvgIcon path={mdiLogout} />
            </span>
          </Tooltip>
        )}
        {directRoom && (
          <Tooltip title="You cannot add members to a direct message room">
            <span className="modal-action-button">
              <SvgIcon path={mdiHelpCircleOutline} />
            </span>
          </Tooltip>
        )}
        <Tooltip title="Close">
          <span
            className="modal-action-button"
            onClick={() => onChangeComposeModal(!showComposeModal)}
          >
            <SvgIcon path={mdiClose} />
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
          <Button
            variant="contained"
            color="primary"
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
        </ModalFooter>
      )}
    </Modal>
  </div>
)
export default connect(null, {
  confirmation
})(enhance(ComposeWrapper))
