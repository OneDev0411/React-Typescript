import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { hideConfirmation } from '../../../store_actions/confirmation'

const Confirmation = ({
  confirmation,
  hideConfirmation
}) => {
  return (
    <div>
      <Modal
        show={confirmation.show}
        dialogClassName="modal-confirmation"
      >
        <Modal.Body>
          <div
            className="confirmation-title"
            dangerouslySetInnerHTML={{
              __html: confirmation.message
            }}
          />
          {
            confirmation.description &&
            <div className="confirmation-descr">
              { confirmation.description}
            </div>
          }

          <div className="cta">

            {
              !confirmation.hideCancelButton &&
              <Button
                className="cancel"
                bsStyle="default"
                onClick={() => {
                  hideConfirmation()

                  if (confirmation.onCancel) {
                    confirmation.onCancel()
                  }
                }}
              >
                { confirmation.cancelLabel || 'Cancel' }
              </Button>
            }

            <Button
              bsStyle="primary"
              className="confirm"
              onClick={() => {
                hideConfirmation()
                confirmation.onConfirm()
              }}
            >
              { confirmation.confirmLabel || 'Confirm' }
            </Button>

          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default connect(({ confirmation }) => ({
  confirmation
}), { hideConfirmation })(Confirmation)
