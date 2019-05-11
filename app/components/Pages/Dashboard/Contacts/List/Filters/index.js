import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { defaultTags } from 'utils/default-tags'

import { operatorAndOperandFilterRenderer } from 'components/Grid/Filters/Types/OparatorAndOperand/renderer'

import { simpleListFilterRenderer } from 'components/Grid/Filters/Types/SimpleList/renderer'

import { searchEvents } from 'models/tasks/search-events'

import { selectTags } from '../../../../../../reducers/contacts/tags'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'

import Filters from '../../../../../../views/components/Grid/Filters'
import SaveSegment from '../../../../../../views/components/Grid/SavedSegments/Create'
import { normalizeFilters } from '../utils'

let getOpenHouseEvents = async () => {
  console.log('getting options')

  const result = await searchEvents({ task_type: 'Open House' })

  console.log('result', result)

  return result.data.map(item => ({
    label: item.title,
    value: item.id
  }))
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

  getOrigins = () => [
    {
      label: 'Brokerage widget',
      value: 'BrokerageWidget'
    },
    {
      label: 'Created by you',
      value: 'ExplicitlyCreated'
    },
    {
      label: 'iOS Contact',
      value: 'IOSAddressBook'
    },
    {
      label: 'Rechat Contact',
      value: 'SharesRoom'
    },
    {
      label: 'Outlook',
      value: 'External/Outlook'
    },
    {
      label: 'Open House',
      value: 'OpenHouse'
    },
    {
      label: 'CSV',
      value: 'CSV'
    }
  ]

  getFilterLabelByValue = value => {
    const origins = this.getOrigins()
    const origin = origins.find(item => item.value === value)

    return origin ? origin.label : value
  }

  /**
   * creates a search criteria for contacts filters
   */
  normalizeFilters = filters => ({
    filters: normalizeFilters(filters),
    args: {
      filter_type: this.props.conditionOperator
    }
  })

  normalizeSegment = (filters, activeFilters) => {
    if (_.size(activeFilters) > 0) {
      return Object.values(activeFilters)
    }

    return filters.map(filter => ({
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
        renderer: operatorAndOperandFilterRenderer({
          options: this.getUniqTags(tags)
        }),
        tooltip:
          'A group a person belongs to, based on a tag you’ve manually applied to them.'
      },
      {
        id: 'openHouse',
        label: 'Open House',
        renderer: simpleListFilterRenderer({
          getOptions: getOpenHouseEvents
        }),
        tooltip: 'Contacts invited to an specific Open House'
      },
      {
        id: sourceDefinition.id,
        label: 'Origin',
        renderer: operatorAndOperandFilterRenderer({
          options: this.getOrigins()
        }),
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
        createFiltersFromSegment={this.normalizeSegment}
        createSegmentFromFilters={this.normalizeFilters}
        onChange={this.props.onFilterChange}
        disableConditionOperators={this.props.disableConditionOperators}
      >
        <SaveSegment />
      </Filters>
    )
  }
}

function mapStateToProps({ contacts }) {
  const { tags, attributeDefs } = contacts

  return {
    tags: selectTags(tags),
    conditionOperator: contacts.filterSegments.conditionOperator,
    attributeDefs
  }
}

export default connect(mapStateToProps)(ContactFilters)
