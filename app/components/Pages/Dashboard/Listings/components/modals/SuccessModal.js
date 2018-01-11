import React from 'react'
import { Modal } from 'react-bootstrap'

const Icon = ({ type }) => {
  switch (type) {
    case 'SAVED_ALERT':
      return (
        <img
          style={{ height: '7rem', marginLeft: '1.3rem' }}
          src="/static/images/dashboard/mls/alert-bell-saved.svg"
        />
      )
    default:
      return (
        <i
          className="fa fa-check"
          style={{ height: '7rem', marginLeft: '0.5rem' }}
        />
      )
  }
}

const SuccessModal = ({ isActive, type, text }) => (
  <Modal dialogClassName="c-success-modal" show={isActive}>
    <div className="c-success-modal__body din">
      <span className="c-success-modal__icon">
        <Icon type={type} />
      </span>
      <div style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' }}>{text}</div>
    </div>
  </Modal>
)

export default SuccessModal
