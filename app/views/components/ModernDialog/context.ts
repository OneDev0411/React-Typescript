import { createContext } from 'react'

export const ModernDialogCloseContext =
  createContext<Optional<() => void>>(undefined)
