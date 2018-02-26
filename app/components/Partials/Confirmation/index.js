import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { hideConfirmation } from '../../../store_actions/confirmation'

class Confirmation extends React.Component {
  constructor(props) {
    super(props)
  }

  onCancel() {
    const { confirmation, hideConfirmation } = this.props

    hideConfirmation()

    if (confirmation.onCancel) {
      confirmation.onCancel()
    }
  }

  onConfirm() {
    const { confirmation, hideConfirmation } = this.props
    const userValue = this.input ? this.input.value : ''

    hideConfirmation()

    if (confirmation.onConfirm) {
      confirmation.onConfirm(userValue)
    }
  }

  render() {
    const { confirmation } = this.props

    return (
      <div>
        <Modal
          show={confirmation.show}
          backdrop="static"
          backdropClassName="modal-confirmation-backdrop"
          dialogClassName="modal-confirmation"
          style={{
            zIndex: 2000
          }}
        >
          <Modal.Body>
            <div
              className="confirmation-title"
              dangerouslySetInnerHTML={{
                __html: confirmation.message
              }}
            />
            {confirmation.description && (
              <div className="confirmation-descr">
                {confirmation.description}
              </div>
            )}

            {confirmation.needsUserEntry && (
              <div className="confirmation-input">
                <textarea
                  defaultValue={confirmation.inputDefaultValue}
                  placeholder={confirmation.inputPlaceholder || ''}
                  ref={ref => (this.input = ref)}
                />
              </div>
            )}

            <div className="cta">
              {!confirmation.hideCancelButton && (
                <Button
                  className="cancel"
                  bsStyle="default"
                  onClick={() => this.onCancel()}
                >
                  {confirmation.cancelLabel || 'Cancel'}
                </Button>
              )}

              <Button
                bsStyle={confirmation.confirmButtonColor || 'primary'}
                className="confirm"
                onClick={() => this.onConfirm()}
              >
                {confirmation.confirmLabel || 'Confirm'}
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default connect(
  ({ confirmation }) => ({
    confirmation
  }),
  { hideConfirmation }
)(Confirmation)
