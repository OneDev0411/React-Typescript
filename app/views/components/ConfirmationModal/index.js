import React, { useContext, useRef } from 'react'

import Modal from '../BareModal'

import ActionBar from './ActionBar'
import UserEntry from './UserEntry'
import ConfirmationModalContext from './context'
import { initialConfirmationModal } from './context/initial-confirmation-modal'
/*
 *
 * This is redux-free confirmation modal.
 * We will deprecate `app/components/Partials/Confirmation/index.js` asap.
 *
 */

function ConfirmationModal() {
  const confirmation = useContext(ConfirmationModalContext)

  // Refs
  const entryInputRef = useRef(null)

  // Callbacks
  const handleCancel = () => {
    if (confirmation.onCancel) {
      confirmation.onCancel()
    }

    // reset context values
    confirmation.setConfirmationModal(initialConfirmationModal)
  }

  const handleConfirm = () => {
    const userValue = entryInputRef.current ? entryInputRef.current.value : ''

    if (confirmation.onConfirm) {
      confirmation.onConfirm(userValue)
    }

    // reset context values
    confirmation.setConfirmationModal(initialConfirmationModal)
  }

  return (
    <Modal
      className="modal-confirmation"
      contentLabel="Confirmation Modal"
      isOpen={confirmation.isShow}
      onRequestClose={handleCancel}
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

      <UserEntry
        isShow={confirmation.needsUserEntry}
        inputDefaultValue={confirmation.inputDefaultValue}
        inputPlaceholder={confirmation.inputPlaceholder}
        multilineEntry={confirmation.multilineEntry}
        ref={entryInputRef}
      />

      <ActionBar
        confirmation={confirmation}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </Modal>
  )
}

export default ConfirmationModal
