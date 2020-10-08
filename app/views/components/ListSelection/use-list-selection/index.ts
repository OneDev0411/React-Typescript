import { useContext } from 'react'

import { StateContext } from '../context'

export function useListSelection() {
  return useContext(StateContext)
}
