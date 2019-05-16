import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import * as fecha from 'fecha'

import { defaultTags } from 'utils/default-tags'

import { searchEvents } from 'models/tasks/search-events'

import { getBrandFlows } from 'models/flows/get-brand-flows'

import { getActiveTeamId } from 'utils/user-teams'

import {
  FLOW_FILTER_ID,
  OPEN_HOUSE_FILTER_ID,
  ORIGINS
} from 'crm/List/constants'

import { isAttributeFilter } from 'crm/List/utils'

import { SimpleList } from 'components/Grid/Filters/FilterTypes/SimpleList'

import { OperatorAndOperandFilter } from 'components/Grid/Filters/FilterTypes/OparatorAndOperand'

import { selectTags } from '../../../../../../reducers/contacts/tags'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'

import Filters from '../../../../../../views/components/Grid/Filters'
import SaveSegment from '../../../../../../views/components/Grid/SavedSegments/Create'
import { normalizeAttributeFilters } from '../utils'

const getOpenHouseEvents = async () => {
  const result = await searchEvents({ task_type: 'Open House' })

  return result.data.map(getOpenHouseFilter)
}

class ContactFilters extends React.PureComponent {
  getUniqTags = tags => {
    if (!tags || tags.length === 0) {
      return []
    }

    return _.uniq([...defaultTags, ..._.pluck(tags, 'text')])
      .sort()
      .map(tag => ({ label: tag, value: tag }))
  }

  getFlows = async () => {
    const result = await getBrandFlows(getActiveTeamId(this.props.user, {}))

    return result.map(getFlowFilter)
  }

  getOrigins = () => ORIGINS

  getFilterLabelByValue = value => {
    const origins = this.getOrigins()
    const origin = origins.find(item => item.value === value)

    return origin ? origin.label : value
  }

  /**
   * creates a search criteria for contacts filters
   */
  createSegmentFromFilters = (filters, operator) => {
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
        crm_task: openHouseFilters.map(filter => filter.values[0].value),
        filter_type: this.props.conditionOperator
      }
    }
  }

  createFiltersFromSegment = segment => {
    const attributeFilters = (segment.filters || []).map(filter => ({
      id: filter.attribute_def,
      isActive: false,
      values: [
        {
          label: this.getFilterLabelByValue(filter.value),
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

  get Config() {
    const { tags, attributeDefs } = this.props

    const tagDefinition = selectDefinitionByName(attributeDefs, 'tag')
    const sourceDefinition = selectDefinitionByName(
      attributeDefs,
      'source_type'
    )

    return [
      {
        id: tagDefinition.id,
        label: 'Tag',
        renderer: props => (
          <OperatorAndOperandFilter
            {...props}
            options={this.getUniqTags(tags)}
          />
        ),
        tooltip:
          'A group a person belongs to, based on a tag you’ve manually applied to them.'
      },
      {
        id: OPEN_HOUSE_FILTER_ID,
        label: 'Open House',
        renderer: props => (
          <SimpleList {...props} getOptions={getOpenHouseEvents} />
        ),
        tooltip: 'Contacts invited to a specific Open House'
      },
      {
        id: FLOW_FILTER_ID,
        label: 'Flows',
        renderer: props => <SimpleList {...props} getOptions={this.getFlows} />,
        tooltip: 'Contacts who are active in a specific flow'
      },
      {
        id: sourceDefinition.id,
        label: 'Origin',
        renderer: props => (
          <OperatorAndOperandFilter {...props} options={this.getOrigins()} />
        ),
        tooltip: 'Source type'
      }
    ]
  }

  render() {
    return (
      <Filters
        name="contacts"
        plugins={['segments']}
        config={this.Config}
        createFiltersFromSegment={this.createFiltersFromSegment}
        onChange={() => this.props.onFilterChange()}
        disableConditionOperators={this.props.disableConditionOperators}
      >
        <SaveSegment createSegmentFromFilters={this.createSegmentFromFilters} />
      </Filters>
    )
  }
}

function mapStateToProps({ contacts, user }) {
  const { tags, attributeDefs } = contacts

  return {
    user,
    tags: selectTags(tags),
    conditionOperator: contacts.filterSegments.conditionOperator,
    attributeDefs
  }
}

export function getOpenHouseFilter(openHouse) {
  return {
    label: `${openHouse.title} - ${fecha.format(
      new Date(openHouse.due_date * 1000),
      'mediumDate'
    )}`,
    value: openHouse.id
  }
}

function getFlowFilter(flow) {
  return {
    label: flow.name,
    value: flow.id
  }
}

export default connect(mapStateToProps)(ContactFilters)
