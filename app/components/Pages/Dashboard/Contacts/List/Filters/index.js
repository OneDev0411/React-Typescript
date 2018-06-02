import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { selectTags } from '../../../../../../reducers/contacts/tags'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'

import { Filters } from '../../../../../../views/components/Grid/Filters'

function getUniqTags(tags) {
  if (!tags || tags.length === 0) {
    return []
  }

  const allTags = tags.map(tag => ({ name: tag.text, value: tag.text }))

  return _.uniq(allTags, item => item.value)
}

function getDef(attributeDefs, name) {
  const definition = selectDefinitionByName(attributeDefs, name)

  return definition ? definition.id : null
}

const ContactFilters = ({ tags, attributeDefs, onFilterChange }) => {
  const config = [
    {
      name: 'tag',
      label: 'Tag',
      type: 'List',
      multi: false,
      options: getUniqTags(tags),
      criteriaParams: {
        attribute_def: getDef(attributeDefs, 'tag')
      },
      tooltip:
        'A group a person belongs to, based on a tag you’ve manually applied to them.'
    }
  ]

  return (
    <Filters
      allowSaveSegment
      currentFilter="All Contacts"
      onChange={onFilterChange}
      config={config}
    />
  )
}

function mapStateToProps({ contacts }) {
  const { tags, attributeDefs } = contacts

  return {
    tags: selectTags(tags),
    attributeDefs
  }
}

export default connect(mapStateToProps)(ContactFilters)
