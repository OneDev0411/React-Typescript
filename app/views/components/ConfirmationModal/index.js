import React, { useContext } from 'react'
import { Modal } from 'react-bootstrap'

import Button from '../Button/ActionButton'
import ConfirmationModalContext from './context'
import { initialConfimationModal } from './ContextProvider'
/*
 *
 * This is redux-free confirmation modal.
 * We will deprecate `app/components/Partials/Confirmation/index.js` asap.
 *
 * @todo This component doesn't have support for needsUserEntry and hiding buttons atm.
 */

function ConfirmationModal(props) {
  const confirmation = useContext(ConfirmationModalContext)

  // Callbacks
  const handleCancel = () => {
    if (confirmation.onCancel) {
      confirmation.onCancel()
    }

    // reset context values
    confirmation.setConfirmationModal(initialConfimationModal)
  }

  const handleConfirm = () => {
    if (confirmation.onConfirm) {
      confirmation.onConfirm()
    }

    // reset context values
    confirmation.setConfirmationModal(initialConfimationModal)
  }

  return (
    <Modal
      show={confirmation.isShow}
      backdrop="static"
      backdropClassName="modal-confirmation-backdrop"
      dialogClassName="modal-confirmation"
      style={{
        zIndex: 2000
      }}
    >
      {confirmation.isShow && (
        <Modal.Body>
          <div
            className="confirmation-title"
            dangerouslySetInnerHTML={{
              __html: confirmation.message
            }}
          />
          {confirmation.description && (
            <div className="confirmation-descr">{confirmation.description}</div>
          )}

          <div className="cta">
            <Button appearance="outline" onClick={handleCancel}>
              {confirmation.cancelLabel || 'Cancel'}
            </Button>
            <Button style={{ marginLeft: '1em' }} onClick={handleConfirm}>
              {confirmation.confirmLabel || 'Confirm'}
            </Button>
          </div>
        </Modal.Body>
      )}
    </Modal>
  )
}

export default ConfirmationModal
