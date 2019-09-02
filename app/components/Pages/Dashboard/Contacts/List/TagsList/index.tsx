import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {
  updateActiveFilter,
  resetActiveFilters
} from 'actions/filter-segments/active-filters'

import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import { selectContactsInfo } from 'reducers/contacts/list'
import {
  IAttributeDefsState,
  selectDefinitionByName
} from 'reducers/contacts/attributeDefs'
import { selectActiveFilters } from 'reducers/filter-segments'

import ToolTip from 'components/tooltip'
import {
  ListTitle,
  ListItem,
  ListItemName
} from 'components/Grid/SavedSegments/List/styled'
import { ShowMoreLess } from 'components/ShowMoreLess'
import IconCog from 'components/SvgIcons/Cog/IconCog'

import { normalizeAttributeFilters } from '../utils'

interface Props {
  attributeDefs: IAttributeDefsState
  activeFilters: StringMap<IActiveFilter>
  onFilterChange: ({ filters: any }) => void // TODO
  existingTags: any // TODO
  isFetching: boolean
  updateActiveFilter: (
    segmentName: string,
    filterId: string,
    filter: any
  ) => void
  resetActiveFilters: (segmentName: string) => void
}

export class TagsList extends React.Component<Props> {
  constructor(props) {
    super(props)
    this.tagDefinitionId = selectDefinitionByName(
      this.props.attributeDefs,
      'tag'
    )!.id
  }

  private tagDefinitionId: string

  onSelectList = item => {
    this.props.resetActiveFilters('contacts')

    const filter = {
      id: this.tagDefinitionId,
      values: [{ value: item.text, label: item.text }],
      operator: {
        name: 'is',
        invert: false
      }
    }

    this.props.updateActiveFilter('contacts', item.id, filter)

    const nextFilters: StringMap<IActiveFilter> = {
      [item.id]: filter
    }

    this.props.onFilterChange({
      filters: normalizeAttributeFilters(nextFilters)
    })
  }

  isSelected = text => {
    return (
      Object.keys(this.props.activeFilters).length === 1 &&
      Object.values(this.props.activeFilters).some(
        filter =>
          filter.id === this.tagDefinitionId &&
          filter.values &&
          filter.values.some(({ value }) => value === text) &&
          !filter.operator.invert
      )
    )
  }

  render() {
    const { existingTags, isFetching } = this.props

    return (
      <div style={{ marginTop: '1rem' }} data-test="tags-list">
        <ListTitle>
          <span>Tags</span>
          <Link to="/dashboard/account/manage-tags">
            <ToolTip caption="Manage tags">
              <IconCog />
            </ToolTip>
          </Link>
        </ListTitle>

        <ShowMoreLess
          moreText="More tags"
          lessText="Less tags"
          style={{ marginBottom: '2rem' }}
        >
          {existingTags.map((item, index) => {
            const isSelected = this.isSelected(item.text)

            return (
              <ToolTip key={index} caption={item.text} placement="right">
                <ListItem
                  data-test={`tag-item-${item.text}`}
                  isSelected={isSelected}
                  onClick={() => this.onSelectList(item)}
                >
                  <ListItemName>{item.text}</ListItemName>
                </ListItem>
              </ToolTip>
            )
          })}
        </ShowMoreLess>

        {isFetching && (
          <ListItem>
            <i className="fa fa-spin fa-spinner" />
          </ListItem>
        )}
      </div>
    )
  }
}

function mapStateToProps(state: {
  contacts: {
    attributeDefs: IAttributeDefsState
    list: any
    tags: any
    filterSegments: IContactReduxFilterSegmentState
  }
}) {
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
    updateActiveFilter,
    resetActiveFilters
  }
)(TagsList)
