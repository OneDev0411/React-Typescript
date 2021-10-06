import { useContext } from 'react'

import { FavoritesContext } from '../context'

export default function useFavoritesContext() {
  const context = useContext(FavoritesContext)

  if (typeof context === 'undefined') {
    throw new Error(
      'useFavoritesContext must be used within a FavoritesContext.Provider'
    )
  }

  return context
}
