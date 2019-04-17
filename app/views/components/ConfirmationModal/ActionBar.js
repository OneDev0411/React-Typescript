import React from 'react'

import Button from '../Button/ActionButton'

function ActionBar(props) {
  const { confirmation, onCancel, onConfirm } = props

  return (
    <div className="cta">
      {confirmation.needsCancel && (
        <Button appearance="outline" onClick={onCancel}>
          {confirmation.cancelLabel || 'Cancel'}
        </Button>
      )}
      {confirmation.needsConfirm && (
        <Button style={{ marginLeft: '1em' }} onClick={onConfirm}>
          {confirmation.confirmLabel || 'Confirm'}
        </Button>
      )}
    </div>
  )
}

export default ActionBar
