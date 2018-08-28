import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { getContactsTags } from '../../../../../../store_actions/contacts/get-contacts-tags'
import { selectTags } from '../../../../../../reducers/contacts/tags'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'

import Filters from '../../../../../../views/components/Grid/Filters'
import SaveSegment from '../../../../../../views/components/Grid/SavedSegments/Create'

class ContactFilters extends React.PureComponent {
  componentDidMount() {
    if (this.props.tags.length === 0) {
      this.props.getContactsTags()
    }
  }

  getUniqTags = tags => {
    if (!tags || tags.length === 0) {
      return []
    }

    return _.uniq(_.pluck(tags, 'text'))
  }

  /**
   * creates a search criteria for contacts filters
   */
  normalizeFilters = filters => {
    const criteria = []

    _.each(filters, filter => {
      _.each(filter.values, value => {
        criteria.push({
          value,
          invert: filter.operator.invert === true,
          attribute_def: filter.id
        })
      })
    })

    return criteria
  }

  normalizeSegment = filters =>
    filters.map(filter => ({
      id: filter.attribute_def,
      isActive: false,
      isIncomplete: false,
      values: [filter.value],
      operator: {
        name: filter.invert ? 'is not' : 'is',
        invert: filter.invert
      }
    }))

  get Config() {
    const { tags, attributeDefs } = this.props

    const tagDefinition = selectDefinitionByName(attributeDefs, 'tag')
    const stageDefinition = selectDefinitionByName(attributeDefs, 'stage')
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
        id: stageDefinition.id,
        label: 'Stage',
        type: 'Set',
        multi: false,
        options: stageDefinition.enum_values,
        tooltip: 'A group a person belongs to'
      },
      {
        id: sourceDefinition.id,
        label: 'Origin',
        type: 'Set',
        multi: false,
        options: [
          'BrokerageWidget',
          'IOSAddressBook',
          'SharesRoom',
          'ExplicitlyCreated',
          'External/Outlook',
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
    attributeDefs
  }
}

export default connect(
  mapStateToProps,
  { getContactsTags }
)(ContactFilters)
