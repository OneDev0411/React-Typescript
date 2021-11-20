import { useContext } from 'react'

import { ListingsUiContext } from './index'

export default function useUiListingsContext() {
  const context = useContext(ListingsUiContext)

  if (typeof context === 'undefined') {
    throw new Error(
      'useUiListingsContext must be used within a ListingsUiContext.Provider'
    )
  }

  return context
}
