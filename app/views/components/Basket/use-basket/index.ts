import { useContext } from 'react'

import { StateContext } from '../context'

export function useBasket() {
  return useContext(StateContext)
}
