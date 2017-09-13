import React from 'react'
import { Modal } from 'react-bootstrap'
import Roles from '../roles'

export default ({
  show,
  deal,
  onHide,
  onAddRecipient
}) => (
  <Modal
    show={show}
    onHide={onHide}
    dialogClassName="modal-deal-esign-add-signer"
  >
    <Modal.Header closeButton>
      Add a signer
    </Modal.Header>

    <Modal.Body>
      <Roles
        deal={deal}
        onSelectRole={role => onAddRecipient(role)}
      />
    </Modal.Body>
  </Modal>
)
