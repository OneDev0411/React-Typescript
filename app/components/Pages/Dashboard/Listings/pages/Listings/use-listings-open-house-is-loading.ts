import { useContext } from 'react'

import { ListingsOpenHouseIsLoadingContext } from './context'

function useListingsOpenHouseIsLoading() {
  const context = useContext(ListingsOpenHouseIsLoadingContext)

  if (context === undefined) {
    throw new Error(
      'You must use useListingsOpenHouseIsLoading within ListingsOpenHouseProvider'
    )
  }

  return context
}

export default useListingsOpenHouseIsLoading
