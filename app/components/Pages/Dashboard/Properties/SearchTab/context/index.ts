import { createContext } from 'react'

import { Thunk } from 'react-hook-thunk-reducer'

import { Actions } from './actions'

export type Context = [
  ICompactListing[],
  React.Dispatch<Actions | Thunk<ICompactListing[], Actions>>
]

export const ListingsContext = createContext<Optional<Context>>(undefined)
