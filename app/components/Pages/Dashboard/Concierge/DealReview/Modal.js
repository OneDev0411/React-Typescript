import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default ({
  title,
  isActive,
  closeHandler,
  submitHandler
}) => {
  let input = ''
  return (
    <Modal show={isActive} onHide={onCloseHandler}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form name="concierge-review">
          <textarea
            ref={(node) => { input = node }}
            className="modal-textarea"
            placeholder="Leave a comment..."
          />
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={onCloseHandler}
              className="c-concierge__modal__btn--cancel"
            >Cancel</Button>
            <Button
              onClick={submitHandler(input)}
              className="c-concierge__modal__btn--approve"
            >Send</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}