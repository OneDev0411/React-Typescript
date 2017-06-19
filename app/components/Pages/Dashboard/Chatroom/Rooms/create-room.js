import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { compose,  withState, lifecycle, pure } from 'recompose'
import Compose from '../../../../Partials/Compose'
import { createRoom } from '../../../../../store_actions/chatroom'

const enhance = compose(
  pure,
  withState('showComposeModal', 'onChangeComposeModal', false),
  withState('recipients', 'onChangeRecipients', {}),
  connect(null, { createRoom })
)

const AddMember = ({
  showComposeModal,
  recipients,
  onChangeComposeModal,
  onChangeRecipients,
  createRoom
}) => (
  <div>
    <div
      className="new-room"
      onClick={() => onChangeComposeModal(!showComposeModal)}
    >
      <i className="fa fa-edit"></i> New Message
    </div>

    <Modal
      show={showComposeModal}
      dialogClassName="chatroom-add-member"
      onHide={() => onChangeComposeModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Members</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Compose
          onHide={() => onChangeComposeModal(false)}
          onChangeRecipients={recipients => onChangeRecipients(recipients)}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button
          bsStyle="primary"
          disabled={([].concat(recipients.users, recipients.emails, recipients.phone_numbers)).length === 0}
          onClick={async () => {
            await createRoom(recipients)
            onChangeComposeModal(false)
          }}
        >
          Create room
        </Button>
      </Modal.Footer>

    </Modal>
  </div>
)

export default enhance(AddMember)
