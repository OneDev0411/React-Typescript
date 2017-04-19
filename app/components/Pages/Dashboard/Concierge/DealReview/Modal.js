import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default ({
  type,
  title,
  isActive,
  isFreezed,
  closeHandler,
  submitHandler,
  selectedReviewId
}) => {
  let input = ''
  return (
    <Modal className="c-concierge-modal" show={isActive} onHide={closeHandler}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          name="concierge-review"
          onSubmit={(e) => {
            e.preventDefault()
            submitHandler({
              type,
              id: selectedReviewId,
              comment: input.value
            })
          }}
        >
          <textarea
            required="true"
            autoFocus="true"
            disabled={isFreezed}
            ref={(node) => { input = node }}
            className="modal-textarea"
            placeholder="Leave a comment..."
          />
          <div style={{ textAlign: 'right' }}>
            <Button
              tabIndex="-1"
              disabled={isFreezed}
              onClick={closeHandler}
              className="c-concierge__modal__btn--cancel"
            >Cancel</Button>
            <Button
              tabIndex="0"
              type="submit"
              bsStyle="primary"
              disabled={isFreezed}
              className="c-concierge__modal__btn--approve"
            >
              {isFreezed ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}