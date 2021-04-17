import { useContext } from 'react'

import { CardStackContext } from './context'

function useCardStackActions() {
  const context = useContext(CardStackContext)

  if (!context) {
    throw new Error('The useCardStackActions must be called within CardStack')
  }

  return { pop: context }
}

export default useCardStackActions
