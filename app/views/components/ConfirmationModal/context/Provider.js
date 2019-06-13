import React, { useState } from 'react'

import ConfirmationModalContext from './index'

export const initialConfimationModal = {
  // Visibility
  isShow: false,
  appearance: 'normal', // normal, danger

  // Default Interface
  message: '',
  description: '',

  // User Entry
  multilineEntry: true,
  needsUserEntry: false,
  inputDefaultValue: '',
  inputPlaceholder: '',

  // Cancel Button
  onCancel: null,
  cancelLabel: '',
  needsCancel: true,

  // Confirm Button
  onConfirm: null,
  confirmLabel: '',
  needsConfirm: true,

  // Methods
  setConfirmationModal: () => {}
}

function ContextProvider(props) {
  const [confimationState, setConfirmationModal] = useState(
    initialConfimationModal
  )

  return (
    <ConfirmationModalContext.Provider
      value={{
        ...confimationState,
        setConfirmationModal: updateContext => {
          // We don't need to pass isShow if we wanna open modal
          // It's also useful for reseting modal context
          let isShow =
            typeof updateContext.isShow == 'undefined' ||
            updateContext.isShow === null

          setConfirmationModal({
            ...initialConfimationModal,
            ...updateContext,
            isShow
          })
        }
      }}
    >
      {props.children}
    </ConfirmationModalContext.Provider>
  )
}

export default ContextProvider
