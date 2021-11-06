import { createContext } from 'react'

import { FavoritesContext as Context } from '../hooks/useFetchFavorites'

export const FavoritesContext = createContext<Optional<Context>>(undefined)
