import { createContext } from 'react'

import {
  initialConfirmationModal,
  InitialConfirmationModalType
} from './initial-confirmation-modal'

export type { InitialConfirmationModalType } from './initial-confirmation-modal'

export default createContext<InitialConfirmationModalType>(
  initialConfirmationModal
)
