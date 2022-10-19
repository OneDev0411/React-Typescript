import { size } from 'lodash'

import { IAttributeDefsState } from '@app/reducers/contacts/attributeDefs'

import { FLOW_FILTER_ID, OPEN_HOUSE_FILTER_ID } from '../../constants'

import { getAttributeFilter } from './get-attribute-filter'
import getFlowFilter from './get-flow-filter'
import getOpenHouseFilter from './get-open-house-filter'

type MetaData = {
  activeFilters?: any
  attributeDefs: IAttributeDefsState
}

const createFiltersFromSegment = (
  segment: Partial<IContactList>,
  { activeFilters, attributeDefs }: MetaData
) => {
  if (size(activeFilters) > 0) {
    return Object.values(activeFilters)
  }

  const attributeFilters = (segment.filters || []).map(filter =>
    getAttributeFilter(filter, attributeDefs.byId[filter.attribute_def!])
  )

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
