import { useMemo } from 'react'

import { ListingRow } from './types'

function useListingsSearchRows(
  rows: ListingRow[],
  search: string
): ListingRow[] {
  return useMemo(() => {
    if (!search) {
      return rows
    }

    return rows.filter(row => {
      const address =
        row.type === 'compact_listing'
          ? row.address.street_address
          : row.property.address.street_address

      return address.includes(search)
    })
  }, [rows, search])
}

export default useListingsSearchRows
