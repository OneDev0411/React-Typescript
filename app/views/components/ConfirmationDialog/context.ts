import { createContext } from 'react'

export const ConfirmationDialogCloseContext =
  createContext<Optional<() => void>>(undefined)
