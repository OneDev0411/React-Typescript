import React from 'react'
import { Modal } from 'react-bootstrap'

export default ({ show }) => (
  <Modal show={show} dialogClassName="modal-import-outlook-loading">
    <Modal.Body>
      <i className="fa fa-spinner fa-spin fa-2x fa-fw import-loading-icon" />
      <div className="confirmation-title">Import in progress</div>
      <div className="confirmation-descr">Importing contacts from Outlook</div>
    </Modal.Body>
  </Modal>
)
