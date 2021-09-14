import { createContext } from 'react'

import { OpenHouseRow } from './types'

export const ListingsOpenHouseRowsContext =
  createContext<Optional<OpenHouseRow[]>>(undefined)

export const ListingsOpenHouseReloadContext =
  createContext<Optional<() => Promise<OpenHouseRow[]>>>(undefined)

export const ListingsOpenHouseIsLoadingContext =
  createContext<Optional<boolean>>(undefined)

export const ListingsOpenHouseHasAccessContext =
  createContext<Optional<boolean>>(undefined)
