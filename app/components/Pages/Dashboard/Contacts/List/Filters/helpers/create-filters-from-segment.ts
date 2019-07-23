import { size } from 'lodash'

import { FLOW_FILTER_ID, OPEN_HOUSE_FILTER_ID } from '../../constants'

import getFilterLabelByValue from './get-filter-label-by-value'
import getFlowFilter from './get-flow-filter'
import getOpenHouseFilter from './get-open-house-filter'

const createFiltersFromSegment = (
  segment: Partial<IContactList>,
  activeFilters?
) => {
  if (size(activeFilters) > 0) {
    return Object.values(activeFilters)
  }

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

  const { flows, crm_tasks } = segment.args || { flows: [], crm_tasks: [] }

  const flowFilters = (flows || []).map(flowId => ({
    id: FLOW_FILTER_ID,
    isActive: false,
    values: [
      getFlowFilter((segment.flows || []).find(flow => flow.id === flowId))
    ],
    operator: {
      name: 'is'
    }
  }))

  const openHouseFilters = (crm_tasks || []).map(crmTaskId => ({
    id: OPEN_HOUSE_FILTER_ID,
    isActive: false,
    values: [
      getOpenHouseFilter(
        (segment.crm_tasks || []).find(crmTask => crmTask.id === crmTaskId)
      )
    ],
    operator: {
      name: 'is'
    }
  }))

  return [...attributeFilters, ...flowFilters, ...openHouseFilters]
}

export default createFiltersFromSegment
