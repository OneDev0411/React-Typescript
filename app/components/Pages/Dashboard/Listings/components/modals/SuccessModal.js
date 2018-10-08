import React from 'react'
import { Modal } from 'react-bootstrap'

const Icon = ({ type }) => {
  const style = { height: '5rem', margin: '1rem 0 0 0.5rem' }

  switch (type) {
    case 'SAVED_ALERT':
      return (
        <img
          alt="bell"
          style={style}
          src="/static/images/dashboard/mls/alert-bell-saved.svg"
        />
      )
    default:
      return <i className="fa fa-check" style={style} />
  }
}

const SuccessModal = ({ isActive, type, text }) => (
  <Modal dialogClassName="c-success-modal" show={isActive}>
    <div className="c-success-modal__body">
      <span className="c-success-modal__icon">
        <Icon type={type} />
      </span>
      <div style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' }}>{text}</div>
    </div>
  </Modal>
)

export default SuccessModal
