import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import styled from 'styled-components'
import { sortBy, uniqBy } from 'lodash'

import { formatedDefaultTags } from 'utils/default-tags'

import {
  removeActiveFilter,
  updateActiveFilter
} from 'actions/filter-segments/active-filters'

import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import { selectContactsInfo } from 'reducers/contacts/list'
import {
  IAttributeDefsState,
  selectDefinitionByName
} from 'reducers/contacts/attributeDefs'
import { selectActiveFilters } from 'reducers/filter-segments'

import ToolTip from 'components/tooltip'
import { CheckBoxButton } from 'components/Button/CheckboxButton'
import {
  ListTitle,
  ListItem,
  ListItemName
} from 'components/Grid/SavedSegments/List/styled'
import { ShowMoreLess } from 'components/ShowMoreLess'
import IconCog from 'components/SvgIcons/Cog/IconCog'

import { normalizeAttributeFilters } from '../utils'

const CustomListItem = styled(ListItem)`
  justify-content: flex-start;
`
const CustomListItemName = styled(ListItemName)`
  margin-left: 0.5em;
`

interface Props {
  attributeDefs: IAttributeDefsState
  activeFilters: StringMap<IActiveFilter>
  removeActiveFilter: (segmentName: string, filterId: string) => void
  onFilterChange: ({ filters: any }) => void // TODO
  existingTags: any // TODO
  isFetching: boolean
  updateActiveFilter: (
    segmentName: string,
    filterId: string,
    filter: any
  ) => void
}

export class TagsList extends React.Component<Props> {
  private tagDefinitionId: string

  constructor(props) {
    super(props)
    this.tagDefinitionId = selectDefinitionByName(
      this.props.attributeDefs,
      'tag'
    )!.id
  }

  onSelectList = item => {
    const { activeFilters } = this.props
    let nextFilters: StringMap<IActiveFilter> = {}

    const filterId = Object.keys(activeFilters).find(id => {
      const filter = activeFilters[id]

      return (
        filter.id === this.tagDefinitionId &&
        filter.values.some(({ value }) => value === item.text)
      )
    })

    if (filterId) {
      this.props.removeActiveFilter('contacts', filterId)
      Object.keys(activeFilters)
        .filter(key => key !== filterId)
        .forEach(key => {
          nextFilters[key] = activeFilters[key]
        })
    } else if (!this.isSelected(item.text)) {
      const filter = {
        id: this.tagDefinitionId,
        values: [{ value: item.text, label: item.text }],
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

    this.props.onFilterChange({
      filters: normalizeAttributeFilters(nextFilters)
    })
  }

  isSelected = text =>
    Object.values(this.props.activeFilters).some(
      filter =>
        filter.id === this.tagDefinitionId &&
        filter.values &&
        filter.values.some(({ value }) => value === text) &&
        !filter.operator.invert
    )

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
                <CustomListItem
                  data-test={`tag-item-${item.text}`}
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
    removeActiveFilter,
    updateActiveFilter
  }
)(TagsList)
