import { Dispatch, SetStateAction, useContext } from 'react'

import { ShowingDetailSetDataContext } from './context'

function useShowingDetailSetData(): Dispatch<SetStateAction<IShowing>> {
  const context = useContext(ShowingDetailSetDataContext)

  if (!context) {
    throw new Error(
      'The useShowingDetailSetData must be used withing ShowingDetailProvider'
    )
  }

  return context
}

export default useShowingDetailSetData
