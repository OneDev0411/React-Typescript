import { useContext } from 'react'

import { StateContext } from '../context'

export function useShareAction() {
  return useContext(StateContext)
}
