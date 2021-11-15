import { createContext } from 'react'

import { Actions } from './actions'
import { IListingUIStates } from './reducers'

export type Context = [IListingUIStates, React.Dispatch<Actions>]

export const ListingsUiContext = createContext<Optional<Context>>(undefined)
