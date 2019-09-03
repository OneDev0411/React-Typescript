import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { sortBy, uniqBy } from 'lodash'

import { formatedDefaultTags } from 'utils/default-tags'

import {
  updateActiveFilter,
  resetActiveFilters
} from 'actions/filter-segments/active-filters'
import { changeActiveFilterSegment } from 'actions/filter-segments/change-active-segment'

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
import { CONTACTS_SEGMENT_NAME } from '../../constants'

interface Props {
  attributeDefs: IAttributeDefsState
  activeFilters: StringMap<IActiveFilter>
  onFilterChange: ({ filters: any }) => void // TODO
  existingTags: any // TODO
  isActive: boolean
  isFetching: boolean
  updateActiveFilter: (
    segmentName: string,
    filterId: string,
    filter: any
  ) => void
  resetActiveFilters: (segmentName: string) => void
  changeActiveFilterSegment: typeof changeActiveFilterSegment
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

  onSelectList = async item => {
    await this.props.changeActiveFilterSegment(CONTACTS_SEGMENT_NAME, 'default')
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
      this.props.isActive &&
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
  const filter = selectContactsInfo(ContactListStore).filter || []
  const searchText = selectContactsInfo(ContactListStore).searchText || ''
  const existingTags = uniqBy(
    sortBy([...formatedDefaultTags, ...selectTags(tags)], 'text'),
    'text'
  )

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
    resetActiveFilters,
    changeActiveFilterSegment
  }
)(TagsList)
