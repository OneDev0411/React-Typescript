import { useContext } from 'react'

import { ListingsOpenHouseRowsContext } from './context'

function useListingsOpenHouseRows() {
  const context = useContext(ListingsOpenHouseRowsContext)

  if (!context) {
    throw new Error(
      'You must use useListingsOpenHouseRows within ListingsOpenHouseProvider'
    )
  }

  return context
}

export default useListingsOpenHouseRows
