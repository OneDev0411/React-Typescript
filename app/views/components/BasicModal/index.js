import React from 'react'
import ReactModal from 'react-modal'

ReactModal.setAppElement('#app')

export default function Modal(props) {
  return (
    <ReactModal
      {...props}
      className="c-modal__content"
      overlayClassName="c-modal__overlay"
    >
      {props.children}
    </ReactModal>
  )
}
