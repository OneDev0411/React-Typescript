import React from 'react'

import {
  ListItem,
  ListItemText,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'
import cn from 'classnames'
import { connect } from 'react-redux'

import {
  updateActiveFilter,
  resetActiveFilters
} from 'actions/filter-segments/active-filters'
import { changeActiveFilterSegment } from 'actions/filter-segments/change-active-segment'
import { BaseDropdownWithMore } from 'components/BaseDropdownWithMore'
import {
  IAttributeDefsState,
  selectDefinitionByName
} from 'reducers/contacts/attributeDefs'
import { selectContactsInfo } from 'reducers/contacts/list'
import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import { selectActiveFilters } from 'reducers/filter-segments'

import { CONTACTS_SEGMENT_NAME } from '../../constants'
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
    },
    item: {
      display: 'inline-block'
    },
    untag: {
      borderBottom: `1px solid ${theme.palette.divider}`
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

  const handleShowUnTagContacts = async () => {
    await props.changeActiveFilterSegment(CONTACTS_SEGMENT_NAME, 'default')
    props.resetActiveFilters('contacts')

    props.updateActiveFilter('contacts', 'untag', {
      id: tagDefinitionId,
      values: [{ value: null, label: 'Un-Tagged' }],
      operator: {
        name: 'is',
        invert: false
      }
    })

    /*
    API Doc.
    If we send null for {tagDefinitionId} value,
    server response us untag contacts
    */
    const untagFilter: IContactAttributeFilter = {
      attribute_def: tagDefinitionId,
      value: null,
      invert: false
    }

    props.onFilterChange({
      filters: [untagFilter]
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
  const isUnTagSelected = props.activeFilters.hasOwnProperty('untag')

  return (
    <BaseDropdownWithMore
      component="div"
      buttonLabel="Tags"
      DropdownToggleButtonProps={{
        className: classes.dropdownBtn,
        disabled: isFetching || existingTags.length === 0
      }}
      listPlugin={{
        style: { width: 220 },
        className: 'u-scrollbar'
      }}
      morePlugin={{
        count: 7,
        style: {
          maxHeight: 250
        },
        textContainer: ({ children }) => (
          <ListItem button className={classes.item}>
            <ListItemText
              primaryTypographyProps={{ variant: 'body2', noWrap: true }}
            >
              {children}
            </ListItemText>
          </ListItem>
        )
      }}
      renderMenu={({ close }) => {
        return [
          <ListItem
            button
            key="untag"
            className={cn(classes.item, classes.untag)}
            selected={isUnTagSelected}
            onClick={() => {
              handleShowUnTagContacts()
              close()
            }}
          >
            <ListItemText
              primaryTypographyProps={{ variant: 'body2', noWrap: true }}
            >
              Has No Tag
            </ListItemText>
          </ListItem>,
          ...existingTags.map((item, index) => {
            const isSelected = checkSelected(item.text)

            return (
              <ListItem
                button
                className={classes.item}
                key={index}
                selected={isSelected}
                onClick={() => {
                  onSelectList(item)
                  close()
                }}
              >
                <ListItemText
                  primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                >
                  {item.text}
                </ListItemText>
              </ListItem>
            )
          })
        ]
      }}
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

export default connect(mapStateToProps, {
  updateActiveFilter,
  resetActiveFilters,
  changeActiveFilterSegment
})(TagsList)
