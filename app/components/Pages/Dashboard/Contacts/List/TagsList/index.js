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
  constructor(props) {
    super(props)
    this.tagDefinitionId = selectDefinitionByName(
      this.props.attributeDefs,
      'tag'
    ).id
  }

  onSelectList = item => {
    const { activeFilters } = this.props
    let nextFilters

    if (this.isSelected(item.text)) {
      const filterId = Object.keys(activeFilters).find(id => {
        const filter = activeFilters[id]

        return (
          filter.id === this.tagDefinitionId &&
          filter.values.includes(item.text)
        )
      })

      this.props.removeActiveFilter('contacts', filterId)
      nextFilters = _.filter(
        activeFilters,
        filter =>
          filter.id !== this.tagDefinitionId ||
          !filter.values.includes(item.text)
      )
    } else {
      const filter = {
        id: this.tagDefinitionId,
        values: [item.text],
        operator: {
          name: 'is',
          invert: false
        }
      }

      this.props.updateActiveFilter('contacts', item.id, filter)
      nextFilters = {
        ...activeFilters,
        [item.id]: filter
      }
    }

    this.props.onFilterChange(normalizeFilters(nextFilters))
  }

  isSelected = text =>
    _.some(
      this.props.activeFilters,
      filter =>
        filter.id === this.tagDefinitionId &&
        filter.values &&
        filter.values.includes(text)
    )

  render() {
    const { existingTags, isFetching } = this.props

    return (
      <div style={{ marginTop: '2rem' }}>
        <ListTitle>Tags</ListTitle>

        {existingTags.map((item, index) => {
          const isSelected = this.isSelected(item.text)

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
