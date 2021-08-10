import { useMemo } from 'react'

import { ListingRow } from './types'

/**
 * This function works based on the status label. If you want to sort it
 * based on the server logic you have to consider this enum:
 * https://gitlab.com/rechat/server/-/blob/master/lib/models/Listing/constants.js
 */
function compareStatus(b: ListingRow, a: ListingRow): number {
  if (b.status < a.status) {
    return 1
  }

  if (b.status > a.status) {
    return -1
  }

  return 0
}

function useListingsListSort(rows: ListingRow[]): ListingRow[] {
  return useMemo(
    () => [...rows].sort((a, b) => compareStatus(b, a) || b.price - a.price),
    [rows]
  )
}

export default useListingsListSort
