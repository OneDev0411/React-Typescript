import React, { useState } from 'react'

import { initialConfirmationModal } from './initial-confirmation-modal'

import ConfirmationModalContext from '.'

function ContextProvider(props) {
  const [confimationState, setConfirmationModal] = useState(
    initialConfirmationModal
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
            ...initialConfirmationModal,
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
