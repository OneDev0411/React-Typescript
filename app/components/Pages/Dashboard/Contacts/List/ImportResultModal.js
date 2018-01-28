import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default ({ importInfo, closeModal }) => (
  <Modal
    show={!!importInfo}
    backdrop="static"
    backdropClassName="modal-confirmation-backdrop"
    dialogClassName="modal-confirmation"
    style={{
      zIndex: 2000
    }}
  >
    <Modal.Body>
      <div className="confirmation-title">Import results</div>
      {importInfo && (
        <div className="confirmation-descr">
          <strong>Successfully imported: </strong>
          {importInfo.count - importInfo.errors}
          <br />
          <strong>Not imported: </strong>
          {importInfo.errors}
        </div>
      )}
      <div className="cta">
        <Button bsStyle={'primary'} className="confirm" onClick={() => closeModal()}>
          Okay
        </Button>
      </div>
    </Modal.Body>
  </Modal>
)
