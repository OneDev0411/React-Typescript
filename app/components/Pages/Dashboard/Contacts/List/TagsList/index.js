import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import _ from 'underscore'

import {
  addActiveFilter,
  removeActiveFilter,
  updateActiveFilter
} from 'actions/filter-segments/active-filters'

import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import { selectContactsInfo } from 'reducers/contacts/list'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'
import { selectActiveFilters } from 'reducers/filter-segments'

import ToolTip from 'components/tooltip'
import { CheckBoxButton } from 'components/Button/CheckboxButton'
import {
  ListTitle,
  ListItem,
  ListItemName
} from 'components/Grid/SavedSegments/List/styled'

import { normalizeFilters } from '../utils'

const CustomListItem = styled(ListItem)`
  justify-content: flex-start;
`
const CustomListItemName = styled(ListItemName)`
  margin-left: 0.5em;
`

class TagsList extends React.Component {
  onSelectList = item => {
    let nextFilters
    const tagDefinition = selectDefinitionByName(
      this.props.attributeDefs,
      'tag'
    )

    if (this.isSelected(item.id)) {
      this.props.removeActiveFilter('contacts', item.id)
      nextFilters = _.filter(
        this.props.activeFilters,
        filter =>
          filter.attribute_def !== tagDefinition.id ||
          filter.value !== item.text
      )
    } else {
      const filter = {
        id: tagDefinition.id,
        values: [item.text],
        operator: {
          name: 'is',
          invert: false
        }
      }

      this.props.updateActiveFilter('contacts', item.id, filter)
      nextFilters = {
        ...this.props.activeFilters,
        [item.id]: filter
      }
    }

    this.props.onFilterChange(normalizeFilters(nextFilters))
  }

  isSelected = id => this.props.activeFilters[id]

  render() {
    const { existingTags, isFetching } = this.props

    return (
      <div style={{ marginTop: '2rem' }}>
        <ListTitle>Tags</ListTitle>

        {existingTags.map((item, index) => {
          const isSelected = this.isSelected(item.id)

          return (
            <ToolTip key={index} caption={item.text} placement="right">
              <CustomListItem
                isSelected={isSelected}
                onClick={() => this.onSelectList(item)}
              >
                <CheckBoxButton
                  isSelected={isSelected}
                  onClick={() => this.onSelectList(item)}
                />
                <CustomListItemName>{item.text}</CustomListItemName>
              </CustomListItem>
            </ToolTip>
          )
        })}

        {isFetching && (
          <ListItem>
            <i className="fa fa-spin fa-spinner" />
          </ListItem>
        )}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {
    contacts: { attributeDefs, list: ContactListStore, tags }
  } = state
  const existingTags = selectTags(tags)
  const filter = selectContactsInfo(ContactListStore).filter || []
  const searchText = selectContactsInfo(ContactListStore).searchText || ''

  return {
    attributeDefs,
    ContactListStore,
    existingTags,
    filter,
    searchText,
    isFetching: isFetchingTags(tags),
    activeFilters: selectActiveFilters(state.contacts.filterSegments)
  }
}

export default connect(
  mapStateToProps,
  {
    addActiveFilter,
    removeActiveFilter,
    updateActiveFilter
  }
)(TagsList)
