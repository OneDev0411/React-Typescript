import { useMemo } from 'react'

import { ListingRow } from './types'

function useListingsSearchRows(
  rows: ListingRow[],
  query: string
): ListingRow[] {
  return useMemo(() => {
    if (!query) {
      return rows
    }

    return rows.filter(row => {
      const address =
        row.type === 'compact_listing'
          ? row.address.street_address
          : row.property.address.street_address

      return address.includes(query)
    })
  }, [rows, query])
}

export default useListingsSearchRows
