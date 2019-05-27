import React from 'react'

import Button from '../Button/ActionButton'

function ActionBar(props) {
  const { confirmation, onCancel, onConfirm } = props

  return (
    <div className="cta">
      {confirmation.needsCancel && (
        <Button
          appearance="outline"
          onClick={onCancel}
          data-test="confirmation-modal-cancel-button"
        >
          {confirmation.cancelLabel || 'Cancel'}
        </Button>
      )}
      {confirmation.needsConfirm && (
        <Button
          style={{ marginLeft: '1em' }}
          onClick={onConfirm}
          data-test="confirmation-modal-confirm-button"
        >
          {confirmation.confirmLabel || 'Confirm'}
        </Button>
      )}
    </div>
  )
}

export default ActionBar
