import { createContext } from 'react'

// TODO: can we add generic type to filter context ?
export const FiltersContext = createContext<any>(undefined)

FiltersContext.displayName = 'FiltersContext'
