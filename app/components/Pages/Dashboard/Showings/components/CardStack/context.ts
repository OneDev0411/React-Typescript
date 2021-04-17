import { createContext } from 'react'

export const CardStackContext = createContext<Optional<() => void>>(undefined)
