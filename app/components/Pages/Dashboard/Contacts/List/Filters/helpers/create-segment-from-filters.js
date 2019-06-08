import { normalizeAttributeFilters, isAttributeFilter } from '../../utils'
import { FLOW_FILTER_ID, OPEN_HOUSE_FILTER_ID } from '../../constants'

/**
 * creates a search criteria for contacts filters
 */
const createSegmentFromFilters = filter_type => filters => {
  const activeFilters = Object.values(filters)
  const flowFilters = activeFilters.filter(
    filter => filter.id === FLOW_FILTER_ID
  )
  const openHouseFilters = activeFilters.filter(
    filter => filter.id === OPEN_HOUSE_FILTER_ID
  )
  const attributeFilters = activeFilters.filter(isAttributeFilter)

  return {
    filters: normalizeAttributeFilters(attributeFilters),
    args: {
      flows: flowFilters.map(filter => filter.values[0].value),
      crm_tasks: openHouseFilters.map(filter => filter.values[0].value),
      filter_type
    }
  }
}

export default createSegmentFromFilters
