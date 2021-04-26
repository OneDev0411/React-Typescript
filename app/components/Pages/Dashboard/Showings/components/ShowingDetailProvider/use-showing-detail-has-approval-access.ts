import { useContext } from 'react'

import { ShowingDetailHasApprovalAccessContext } from './context'

function useShowingDetailHasApprovalAccess(): boolean {
  const context = useContext(ShowingDetailHasApprovalAccessContext)

  if (context === undefined) {
    throw new Error(
      'The useShowingDetailHasApprovalAccess must be used withing ShowingDetailProvider'
    )
  }

  return context
}

export default useShowingDetailHasApprovalAccess
