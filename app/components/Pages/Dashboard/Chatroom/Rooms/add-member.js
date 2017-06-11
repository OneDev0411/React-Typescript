import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { compose,  withState, lifecycle, pure } from 'recompose'
import Compose from '../../../../Partials/Compose'

const enhance = compose(
  pure,
  withState('showComposeModal', 'onChangeCompose', false),
  withState('recipients', 'onChangeRecipients', {})
)

const AddMember = ({
  showComposeModal,
  recipients,
  onChangeCompose,
  onChangeRecipients
}) => (
  <div>
    <div
      className="new-room"
      onClick={() => onChangeCompose(!showComposeModal)}
    >
      <i className="fa fa-edit"></i> New Message
    </div>

    <Modal
      show={showComposeModal}
      dialogClassName="chatroom-add-member"
      onHide={() => onChangeCompose(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Members</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Compose
          show={true}
          onHide={() => onChangeCompose(false)}
          onChangeRecipients={recipients => onChangeRecipients(recipients)}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button
          bsStyle="primary"
          onClick={() => {
            alert(recipients.toString())
          }}
        >
          Add
        </Button>
      </Modal.Footer>

    </Modal>
  </div>
)

export default enhance(AddMember)
