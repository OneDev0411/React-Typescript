import { useMemo } from 'react'

import { sanitizeSearchTerm } from '@app/utils/sanitize-string'

import { ListingRow } from './types'

function useListingsSearchRows(
  rows: ListingRow[],
  query: string
): ListingRow[] {
  return useMemo(() => {
    if (!query) {
      return rows
    }

    const sanitizedQuery = sanitizeSearchTerm(query)

    return rows.filter(row => {
      const address =
        row.type === 'compact_listing'
          ? row.address.street_address
          : row.property.address.street_address

      const sanitizedAddress = sanitizeSearchTerm(address)

      return sanitizedAddress.includes(sanitizedQuery)
    })
  }, [rows, query])
}

export default useListingsSearchRows
