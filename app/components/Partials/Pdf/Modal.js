import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import PdfViewer from './Viewer'

export default ({
  file,
  isActive,
  onCloseHandler
}) => {
  const { name, src } = file
  return (
    <Modal className="pdf-preview-modal" show={isActive} onHide={onCloseHandler}>
      <Modal.Header>
        <Modal.Title>{name}</Modal.Title>
        <button
          onClick={onCloseHandler}
          className="pdf-preview-modal__close-btn"
        >
          <svg fill="#2196f3" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path fill="#2196f3" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" /></svg>
          <span>esc</span>
        </button>
      </Modal.Header>
      <Modal.Body>
        {
          file.type === 'pdf'
          ? <PdfViewer uri={file.src} />
          : <img src={src} alt={name} className="pdf-preview-modal__image" />
        }
      </Modal.Body>
    </Modal>
  )
}
