import { createContext } from 'react'

import { ListingsContext as Context } from '../hooks/useFetchListings'

export const ListingsContext = createContext<Optional<Context>>(undefined)
