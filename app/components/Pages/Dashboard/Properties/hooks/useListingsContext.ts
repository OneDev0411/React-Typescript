import { useContext } from 'react'

import { ListingsContext } from '../context'

export default function useListingsContext() {
  const context = useContext(ListingsContext)

  if (typeof context === 'undefined') {
    throw new Error(
      'useListingsContext must be used within a ListingsContext.Provider'
    )
  }

  return context
}
