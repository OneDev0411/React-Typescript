import React from 'react'
import { Modal } from 'react-bootstrap'
import S from 'shorti'

export default ({ show, text }) => (
  <Modal
    dialogClassName="modal-alert-saved"
    show={show}
  >
    <div className="din" style={S('text-center font-60 color-fff')}>
      <div style={S('bg-2196f3 w-165 h-165 br-100 center-block pt-35')}>
        <i className="fa fa-check" style={S('h-70 mt-20')} />
      </div>
      <span style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' }}>
        { text }
      </span>
    </div>
  </Modal>
)
