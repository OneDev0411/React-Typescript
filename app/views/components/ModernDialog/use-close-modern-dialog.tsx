import { useContext } from 'react'

import { ModernDialogCloseContext } from './context'

export function useCloseModernDialog() {
  const context = useContext(ModernDialogCloseContext)

  if (!context) {
    throw new Error(
      'The useCloseModernDialog hook must be used within a ModernDialog component'
    )
  }

  return context
}
