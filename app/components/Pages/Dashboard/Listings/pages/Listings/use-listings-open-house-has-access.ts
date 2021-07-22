import { useContext } from 'react'

import { ListingsOpenHouseHasAccessContext } from './context'

function useListingsOpenHouseHasAccess() {
  const context = useContext(ListingsOpenHouseHasAccessContext)

  if (context === undefined) {
    throw new Error(
      'You must use useListingsOpenHouseHasAccess within ListingsOpenHouseProvider'
    )
  }

  return context
}

export default useListingsOpenHouseHasAccess
