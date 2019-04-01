import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { defaultTags } from 'utils/default-tags'

import { selectTags } from '../../../../../../reducers/contacts/tags'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'

import Filters from '../../../../../../views/components/Grid/Filters'
import SaveSegment from '../../../../../../views/components/Grid/SavedSegments/Create'
import { normalizeFilters } from '../utils'

class ContactFilters extends React.PureComponent {
  getUniqTags = tags => {
    if (!tags || tags.length === 0) {
      return []
    }

    return _.uniq([...defaultTags, ..._.pluck(tags, 'text')]).sort()
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
      isIncomplete: false,
      values: [filter.value],
      operator: {
        name: filter.invert ? 'is not' : 'is',
        invert: filter.invert
      }
    }))
  }

  getOriginNameByTitle = title => {
    switch (title) {
      case 'Brokerage widget':
        return 'BrokerageWidget'
      case 'Created by you':
        return 'ExplicitlyCreated'
      case 'iOS Contact':
        return 'IOSAddressBook'
      case 'Rechat Contact':
        return 'SharesRoom'
      case 'Outlook':
        return 'External/Outlook'
      case 'Open House':
        return 'OpenHouse'
      case 'CSV':
        return 'CSV'
    }
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
        type: 'Set',
        multi: false,
        options: this.getUniqTags(tags),
        tooltip:
          'A group a person belongs to, based on a tag you’ve manually applied to them.'
      },
      {
        id: sourceDefinition.id,
        label: 'Origin',
        type: 'Set',
        multi: false,
        postSelectFormat: this.getOriginNameByTitle,
        options: [
          'Brokerage widget',
          'Created by you',
          'iOS Contact',
          'Rechat Contact',
          'Outlook',
          'Open House',
          'CSV'
        ],
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
