import React from 'react'

import Button from '../Button/ActionButton'

import { ActionBarContainer } from './styled'

function ActionBar(props) {
  const { confirmation, onCancel, onConfirm } = props

  return (
    <ActionBarContainer className="cta" appearance={confirmation.appearance}>
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
          className="modal-confirm"
          data-test="confirmation-modal-confirm-button"
        >
          {confirmation.confirmLabel || 'Confirm'}
        </Button>
      )}
    </ActionBarContainer>
  )
}

export default ActionBar
