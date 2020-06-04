import React from 'react'

import Button from '@material-ui/core/Button'

import { ActionBarContainer } from './styled'

interface Props {
  confirmation: any // todo: ask Mojtaba to add type to the context
  submitDisabled: boolean
  onCancel(): void
  onConfirm(): void
}

function ActionBar({
  confirmation,
  submitDisabled,
  onCancel,
  onConfirm
}: Props) {
  return (
    <ActionBarContainer className="cta" appearance={confirmation.appearance}>
      {confirmation.needsCancel && (
        <Button
          variant="outlined"
          onClick={onCancel}
          data-test="confirmation-modal-cancel-button"
        >
          {confirmation.cancelLabel || 'Cancel'}
        </Button>
      )}

      {confirmation.needsConfirm && (
        <Button
          disabled={submitDisabled}
          style={{ marginLeft: '1em' }}
          onClick={onConfirm}
          variant="contained"
          color="primary"
          data-test="confirmation-modal-confirm-button"
        >
          {confirmation.confirmLabel || 'Confirm'}
        </Button>
      )}
    </ActionBarContainer>
  )
}

export default ActionBar
