import { createContext } from 'react'

import { IListingUIStates } from '../types'

import { Actions } from './actions'

export type Context = [IListingUIStates, React.Dispatch<Actions>]

export const ListingsUiContext = createContext<Optional<Context>>(undefined)
