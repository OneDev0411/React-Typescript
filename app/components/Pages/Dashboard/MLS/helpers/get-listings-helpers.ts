import { pickBy } from 'lodash'

import { ListingSearchOptions } from '../ExploreTab/context/reducers'
import { Sort } from '../types'

import { coordToPoint, pointFromBounds } from './map-helpers'
import { parseToValertSort } from './sort-utils'

export function createValertQueryString(
  zoom: Optional<number>,
  proposedAgentZoomLevel: number,
  brand: Nullable<IBrand>,
  sort: Sort
): string {
  let query = ''

  if (brand != null && zoom && zoom >= proposedAgentZoomLevel) {
    const office = brand.offices && brand.offices[0] ? brand.offices[0] : null

    query = 'associations=compact_listing.proposed_agent&'

    if (office) {
      query += `order_by[]=office&order_by[]=status&office=${office}&`
    }
  }

  if (sort) {
    const orderByQuery = parseToValertSort(sort.index)
    const sortDirQuery = sort.ascending ? '+' : '-'

    query += `order_by[]=${encodeURIComponent(sortDirQuery + orderByQuery)}`
  }

  return query
}

export function createValertOptions(
  search: ListingSearchOptions,
  limit: number
) {
  const points =
    search.drawing.length > 0
      ? search.drawing.map(coordToPoint)
      : pointFromBounds(search.bounds)

  return {
    // TO remove null values
    ...pickBy(search.filters),
    // If the criteria includes a zip code, then we should not provide points anymore.
    // https://gitlab.com/rechat/web/-/merge_requests/2829#note_802763782
    ...(search.filters.postal_codes?.length ? {} : { points }),
    ...(search.office ? { offices: [search.office] } : {}),
    limit
  }
}

export const getPropertyTypeFirstElement = (
  filters: AlertFilters
): Optional<IPropertyType> => {
  return filters.property_types ? filters.property_types[0] : undefined
}
