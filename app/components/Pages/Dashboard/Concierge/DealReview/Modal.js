import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default ({
  title,
  isActive,
  onCloseHandler,
  onSubmitHandler
}) => (
  <Modal show={isActive} onHide={onCloseHandler}>
    <Modal.Header>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <form>
        <textarea
          className="modal-textarea"
          placeholder="Leave a comment..."
        />
        <div style={{ textAlign: 'right' }}>
          <Button
            type="button"
            onClick={onCloseHandler}
            style={{
              width: '100px',
              height: '32px',
              borderRadius: '4px',
              backgroundColor: '#f6f6f6',
              color: '#5b6469',
              lineHeight: 1,
              borderWidth: 0,
              display: 'inline-block',
              marginRight: '1rem'
            }}
          >Cancel</Button>
          <Button
            type="button"
            bsStyle="primary"
            onClick={onSubmitHandler}
            style={{
              width: '100px',
              height: '32px',
              borderRadius: '4px',
              lineHeight: 1,
              borderWidth: 0,
              backgroundColor: '#2196f3'
            }}
          >Send</Button>
        </div>
      </form>
    </Modal.Body>
  </Modal>
)