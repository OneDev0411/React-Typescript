import { pickBy } from 'lodash'

import { ListingSearchOptions } from '../ExploreTab/context/reducers'

import { coordToPoint, pointFromBounds } from './map-helpers'
import { Sort, parseToValertSort } from './sort-utils'

export function createValertQueryString(
  zoom: Optional<number>,
  proposedAgentZoomLevel: number,
  brand: Nullable<IBrand>,
  sort: Sort
): string {
  let query = ''

  if (brand != null && zoom && zoom >= proposedAgentZoomLevel) {
    const office = brand.offices && brand.offices[0] ? brand.offices[0] : null

    query = '?associations=compact_listing.proposed_agent'

    if (office) {
      query += `&order_by[]=office&order_by[]=status&office=${office}`
    }
  }

  if (sort) {
    const orderByQuery = parseToValertSort(sort.index)
    const sortDirQuery = sort.ascending ? 'ASC' : 'DESC'

    query += `&order_by[]=${orderByQuery}&sort_dir=${sortDirQuery}`
  }

  return query
}

export function createValertOptions(
  search: ListingSearchOptions,
  postalCodes: Nullable<string[]>,
  limit: number
) {
  const points =
    search.drawing.length > 0
      ? search.drawing.map(coordToPoint)
      : pointFromBounds(search.bounds)

  return {
    ...pickBy(search.filters), // TO remove null values
    points,
    ...(search.office ? { offices: [search.office] } : {}),
    postal_codes: postalCodes,
    limit
  }
}
