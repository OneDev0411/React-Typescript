import { ListingSearchOptions } from '../ExploreTab/context/reducers'

import { coordToPoint, pointFromBounds } from './map-helpers'

export function createValertQueryString(
  zoom: Optional<number>,
  proposedAgentZoomLevel: number,
  brand: Nullable<IBrand>
): string {
  let query = ''

  if (brand != null && zoom && zoom >= proposedAgentZoomLevel) {
    const office = brand.offices && brand.offices[0] ? brand.offices[0] : null

    query = '?associations=compact_listing.proposed_agent'

    if (office) {
      query += `&order_by[]=office&order_by[]=status&office=${office}`
    }
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
    ...search.filters,
    points,
    ...(search.office ? { offices: [search.office] } : {}),
    postal_codes: postalCodes,
    limit
  }
}
