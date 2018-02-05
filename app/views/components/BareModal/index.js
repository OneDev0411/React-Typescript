import React from 'react'
import ReactModal from 'react-modal'

ReactModal.setAppElement('#app')

export default function BareModal(props) {
  return (
    <ReactModal
      {...props}
      overlayClassName="c-modal__overlay"
      className={`c-modal__content ${props.className}`}
    >
      {props.children}
    </ReactModal>
  )
}
