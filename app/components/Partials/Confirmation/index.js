import React from 'react'
import { connect } from 'react-redux'

import { hideConfirmation } from '../../../store_actions/confirmation'

import Modal from '../../../views/components/BareModal'
import Button from '../../../views/components/Button/ActionButton'

class Confirmation extends React.Component {
  onCancel = () => {
    this.props.dispatch(hideConfirmation())

    if (this.props.confirmation.onCancel) {
      this.props.confirmation.onCancel()
    }
  }

  onConfirm = () => {
    const userValue = this.input ? this.input.value : ''

    this.props.dispatch(hideConfirmation())

    if (this.props.confirmation.onConfirm) {
      this.props.confirmation.onConfirm(userValue)
    }
  }

  renderInput() {
    const { confirmation } = this.props
    const sharedProps = {
      defaultValue: confirmation.inputDefaultValue,
      placeholder: confirmation.inputPlaceholder || '',
      style: confirmation.inputStyle || {},
      ref: ref => (this.input = ref)
    }

    if (confirmation.multilineEntry === false) {
      return <input {...sharedProps} className="confirmation-input textinput" />
    }

    return <textarea {...sharedProps} className="confirmation-input textarea" />
  }

  render() {
    const { confirmation } = this.props

    return (
      <Modal
        className="modal-confirmation"
        contentLabel="Confirmation Modal"
        isOpen={confirmation.show}
        onRequestClose={this.onCancel}
        style={{
          overlay: {
            zIndex: 1003
          }
        }}
        noFooter
      >
        <div
          className="confirmation-title"
          dangerouslySetInnerHTML={{
            __html: confirmation.message
          }}
        />
        {confirmation.description && (
          <div className="confirmation-descr">{confirmation.description}</div>
        )}

        {confirmation.needsUserEntry && this.renderInput()}

        <div className="cta">
          {!confirmation.hideCancelButton && (
            <Button
              appearance="outline"
              onClick={() => this.onCancel()}
              data-test="confirmation-modal-cancel-button"
            >
              {confirmation.cancelLabel || 'Cancel'}
            </Button>
          )}
          {!confirmation.hideConfirmButton && (
            <Button
              style={{ marginLeft: '1em' }}
              onClick={() => this.onConfirm()}
              data-test="confirmation-modal-confirm-button"
            >
              {confirmation.confirmLabel || 'Confirm'}
            </Button>
          )}
        </div>
      </Modal>
    )
  }
}

export default connect(({ confirmation }) => ({
  confirmation
}))(Confirmation)
