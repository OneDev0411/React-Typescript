import { ReactNode } from 'react'

import {
  ListingsOpenHouseHasAccessContext,
  ListingsOpenHouseIsLoadingContext,
  ListingsOpenHouseReloadContext,
  ListingsOpenHouseRowsContext
} from './context'
import useListingsLoadOpenHouseRows from './use-listings-load-open-house-rows'

interface ListingsOpenHouseProviderProps {
  children: ReactNode
}

function ListingsOpenHouseProvider({
  children
}: ListingsOpenHouseProviderProps) {
  const { rows, reload, hasAccess, isLoading } = useListingsLoadOpenHouseRows()

  return (
    <ListingsOpenHouseRowsContext.Provider value={rows}>
      <ListingsOpenHouseReloadContext.Provider value={reload}>
        <ListingsOpenHouseIsLoadingContext.Provider value={isLoading}>
          <ListingsOpenHouseHasAccessContext.Provider value={hasAccess}>
            {children}
          </ListingsOpenHouseHasAccessContext.Provider>
        </ListingsOpenHouseIsLoadingContext.Provider>
      </ListingsOpenHouseReloadContext.Provider>
    </ListingsOpenHouseRowsContext.Provider>
  )
}

export default ListingsOpenHouseProvider
