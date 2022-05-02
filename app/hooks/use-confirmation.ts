import { useContext } from 'react'

import ConfirmationModalContext, {
  InitialConfirmationModalType
} from '@app/views/components/ConfirmationModal/context'

function useConfirmation(): InitialConfirmationModalType {
  const confirmation = useContext(ConfirmationModalContext)

  if (!confirmation) {
    throw new Error(
      'useConfirmation must be used under ConfirmationModalProvider'
    )
  }

  return confirmation
}

export default useConfirmation
