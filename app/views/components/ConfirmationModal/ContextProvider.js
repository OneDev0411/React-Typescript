import React, { useState } from 'react'

import ConfirmationModalContext from './context'

export const initialConfimationModal = {
  isShow: false,
  message: '',
  description: '',
  onCancel: null,
  cancelLabel: '',
  onConfirm: null,
  confirmLabel: '',
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
