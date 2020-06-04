import { useContext } from 'react'

import { MediaManagerContext } from '../context'

export default function useMediaManagerContext() {
  const { state, dispatch } = useContext(MediaManagerContext)

  if (state === undefined || dispatch === undefined) {
    throw new Error(
      'useMediaManagerContext must be used within a MediaManagerContext.Provider'
    )
  }

  return {
    state,
    dispatch
  }
}
