import React from 'react'
import { connect } from 'react-redux'

import {
  ListItem,
  ListItemText,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'

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

import { BaseDropdownWithMore } from 'components/BaseDropdownWithMore'

import { normalizeAttributeFilters } from '../utils'
import { CONTACTS_SEGMENT_NAME } from '../../constants'

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
  changeActiveFilterSegment: (nameId: string, segmentId: string) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropdownBtn: {
      ...theme.typography.body1,
      color: theme.palette.common.black,
      '&.Mui-disabled': {
        color: theme.palette.text.disabled,
        '& svg': {
          fill: theme.palette.text.disabled
        }
      }
    }
  })
)

export const TagsList = (props: Props) => {
  const classes = useStyles()
  const tagDefinitionId: string = selectDefinitionByName(
    props.attributeDefs,
    'tag'
  )!.id
  const { existingTags, isFetching } = props

  const onSelectList = async item => {
    await props.changeActiveFilterSegment(CONTACTS_SEGMENT_NAME, 'default')
    props.resetActiveFilters('contacts')

    const filter = {
      id: tagDefinitionId,
      values: [{ value: item.text, label: item.text }],
      operator: {
        name: 'is',
        invert: false
      }
    }

    props.updateActiveFilter('contacts', item.id, filter)

    const nextFilters: StringMap<IActiveFilter> = {
      [item.id]: filter
    }

    props.onFilterChange({
      filters: normalizeAttributeFilters(nextFilters)
    })
  }

  const checkSelected = text => {
    return (
      Object.keys(props.activeFilters).length === 1 &&
      Object.values(props.activeFilters).some(
        filter =>
          filter.id === tagDefinitionId &&
          filter.values &&
          filter.values.some(({ value }) => value === text) &&
          !filter.operator.invert
      )
    )
  }

  return (
    <BaseDropdownWithMore
      buttonLabel="Tags"
      DropdownToggleButtonProps={{
        className: classes.dropdownBtn,
        disabled: isFetching || existingTags.length === 0
      }}
      listPlugin={{
        style: { width: 220 }
      }}
      morePlugin={{
        count: 5,
        textContainer: ({ children }) => <ListItem button>{children}</ListItem>
      }}
      renderMenu={({ close }) =>
        existingTags.map((item, index) => {
          const isSelected = checkSelected(item.text)

          return (
            <ListItem
              button
              key={index}
              selected={isSelected}
              onClick={() => {
                onSelectList(item)
                close()
              }}
            >
              <ListItemText primaryTypographyProps={{ noWrap: true }}>
                {item.text}
              </ListItemText>
            </ListItem>
          )
        })
      }
    />
  )
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
  const existingTags = selectTags(tags)

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
