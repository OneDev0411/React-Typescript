import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { compose,  withState, lifecycle, pure } from 'recompose'
import Compose from '../../../../Partials/Compose'

const enhance = compose(
  pure,
  withState('showComposeModal', 'onChangeComposeModal', false),
  withState('recipients', 'onChangeRecipients', {})
)

function hasRecipients(recipients) {
  const recps = []
    .concat(recipients.users, recipients.emails, recipients.phone_numbers)
    .filter(recp => recp !== undefined)

  return recps.length > 0
}

const ComposeWrapper = ({
  TriggerButton,
  InitialValues,
  title,
  buttonTitle,
  onButtonClick,
  room = null,
  inline = false,
  dropDownBox = false,
  disabled = false,
  /* internal props and states */
  showComposeModal,
  recipients,
  onChangeComposeModal,
  onChangeRecipients
}) => (
  <div
    style={{ display: inline ? 'inline' : 'block' }}
  >
    <TriggerButton
      clickHandler={() => onChangeComposeModal(!showComposeModal)}
    />

    <Modal
      show={showComposeModal}
      dialogClassName="chatroom-add-member"
      onHide={() => onChangeComposeModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {
          !disabled &&
          <Compose
            dropDownBox={dropDownBox}
            onHide={() => onChangeComposeModal(false)}
            onChangeRecipients={recipients => onChangeRecipients(recipients)}
          />
        }

        { InitialValues && <InitialValues /> }
      </Modal.Body>

      {
        !disabled &&
        <Modal.Footer>
          <Button
            bsStyle="primary"
            disabled={!hasRecipients(recipients)}
            onClick={async () => {
              await onButtonClick(recipients)
              // reset states
              onChangeComposeModal(false)
              onChangeRecipients({})
            }}
          >
            { buttonTitle }
          </Button>
        </Modal.Footer>
      }

    </Modal>
  </div>
)

export default enhance(ComposeWrapper)
