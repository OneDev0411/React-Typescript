import { useContext } from 'react'

import { ShowingDetailIdContext } from './context'

function useShowingDetailId(): UUID {
  const context = useContext(ShowingDetailIdContext)

  if (!context) {
    throw new Error(
      'The useShowingDetailId must be used withing ShowingDetailProvider'
    )
  }

  return context
}

export default useShowingDetailId
