import { FLOW_FILTER_ID, OPEN_HOUSE_FILTER_ID } from '../../constants'

import getFilterLabelByValue from './get-filter-label-by-value'
import getFlowFilter from './get-flow-filter'
import getOpenHouseFilter from './get-open-house-filter'

const createFiltersFromSegment = segment => {
  const attributeFilters = (segment.filters || []).map(filter => ({
    id: filter.attribute_def,
    isActive: false,
    values: [
      {
        label: getFilterLabelByValue(filter.value),
        value: filter.value
      }
    ],
    operator: {
      name: filter.invert ? 'is not' : 'is',
      invert: filter.invert
    }
  }))

  const { flows, crm_task } = segment.args || {}

  const flowFilters = (flows || []).map(flowId => ({
    id: FLOW_FILTER_ID,
    isActive: false,
    values: [getFlowFilter(segment.flows.find(flow => flow.id === flowId))],
    operator: {
      name: 'is'
    }
  }))

  const openHouseFilters = (crm_task || []).map(crmTaskId => ({
    id: OPEN_HOUSE_FILTER_ID,
    isActive: false,
    values: [
      getOpenHouseFilter(segment.crm_task.find(flow => flow.id === crmTaskId))
    ],
    operator: {
      name: 'is'
    }
  }))

  return [...attributeFilters, ...flowFilters, ...openHouseFilters]
}

export default createFiltersFromSegment
