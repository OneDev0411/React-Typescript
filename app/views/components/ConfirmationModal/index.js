import React, { useEffect, useContext, useState } from 'react'

import Modal from '../BareModal'

import ActionBar from './ActionBar'
import { UserEntry } from './UserEntry'
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

  const [userEntry, setUserEntry] = useState('')

  useEffect(() => {
    if (confirmation.isShow) {
      setUserEntry(confirmation.inputDefaultValue)
    }
  }, [confirmation.inputDefaultValue, confirmation.isShow])

  // Callbacks
  const handleCancel = () => {
    if (confirmation.onCancel) {
      confirmation.onCancel()
    }

    // reset context values
    confirmation.setConfirmationModal(initialConfirmationModal)
  }

  const handleConfirm = () => {
    if (confirmation.onConfirm) {
      confirmation.onConfirm(userEntry.trim())
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
      {confirmation.isShow && (
        <>
          <div
            className="confirmation-title"
            dangerouslySetInnerHTML={{
              __html: confirmation.message
            }}
            data-test="confirmation-modal-title"
          />

          {confirmation.description && (
            <div
              className="confirmation-descr"
              data-test="confirmation-modal-description"
            >
              {confirmation.description}
            </div>
          )}

          <UserEntry
            value={userEntry}
            show={confirmation.needsUserEntry}
            inputPlaceholder={confirmation.inputPlaceholder}
            multiline={confirmation.multilineEntry}
            onChange={setUserEntry}
          />

          <ActionBar
            submitDisabled={
              confirmation.needsUserEntry && userEntry.trim().length === 0
            }
            confirmation={confirmation}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
          />
        </>
      )}
    </Modal>
  )
}

export default ConfirmationModal
