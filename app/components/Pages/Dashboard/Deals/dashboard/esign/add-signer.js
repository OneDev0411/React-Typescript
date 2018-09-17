import React from 'react'
import Roles from '../../components/roles'
import Modal from '../../../../../../views/components/BasicModal'
import CancelButton from '../../../../../../views/components/Button/CancelButton'

export default ({ show, deal, onHide, onAddRecipient }) => (
  <Modal
    isOpen={show}
    className="c-add-signer-modal"
    contentLabel="Add a Signer"
    handleOnClose={onHide}
  >
    <Modal.Header title="Add a Signer" />
    <Modal.Body>
      <Roles
        deal={deal}
        isEmailRequired
        allowDeleteRole={false}
        onSelect={onAddRecipient}
      />
    </Modal.Body>
    <Modal.Footer style={{ flexDirection: 'row-reverse' }}>
      <CancelButton onClick={onHide}>Cancel</CancelButton>
    </Modal.Footer>
  </Modal>
)
