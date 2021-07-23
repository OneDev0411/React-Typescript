import { useContext } from 'react'

import { ListingsOpenHouseReloadContext } from './context'

function useListingsOpenHouseReload() {
  const context = useContext(ListingsOpenHouseReloadContext)

  if (!context) {
    throw new Error(
      'You must use useListingsOpenHouseReload within ListingsOpenHouseProvider'
    )
  }

  return context
}

export default useListingsOpenHouseReload
