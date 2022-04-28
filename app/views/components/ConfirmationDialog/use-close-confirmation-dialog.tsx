import { useContext } from 'react'

import { ConfirmationDialogCloseContext } from './context'

export function useCloseConfirmationDialog() {
  const context = useContext(ConfirmationDialogCloseContext)

  if (!context) {
    throw new Error(
      'The useCloseConfirmationDialog hook must be used within a ConfirmationDialog component'
    )
  }

  return context
}
