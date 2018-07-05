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

  getDef = (attributeDefs, name) => {
    const definition = selectDefinitionByName(attributeDefs, name)

    return definition ? definition.id : null
  }

  get Config() {
    const { tags, attributeDefs } = this.props

    return [
      {
        id: 'tag',
        label: 'Tag',
        type: 'Set',
        multi: false,
        options: this.getUniqTags(tags),
        additionalParams: {
          attribute_def: this.getDef(attributeDefs, 'tag')
        },
        tooltip:
          'A group a person belongs to, based on a tag you’ve manually applied to them.'
      }
    ]
  }

  render() {
    const { onFilterChange } = this.props

    return (
      <Filters
        name="contacts"
        plugins={['segments']}
        config={this.Config}
        onChange={onFilterChange}
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
