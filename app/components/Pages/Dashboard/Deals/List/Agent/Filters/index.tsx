import React from 'react'
import { withRouter, WithRouterProps } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

import { MenuItem } from '@material-ui/core'

import { IAppState } from 'reducers'

import { putUserSetting } from 'models/user/put-user-setting'
import { getUserTeams } from 'actions/user/teams'

import { SortableColumn } from 'components/Grid/Table/types'
import { PageTabs, Tab, TabLink, DropdownTab } from 'components/PageTabs'

import {
  SORTABLE_COLUMNS,
  SORT_FIELD_SETTING_KEY
} from '../helpers/agent-sorting'
import { getGridSortLabel, getActiveSort } from '../../helpers/sorting'

const BASE_URL = '/dashboard/deals'

const TAB_ITEMS = [
  {
    label: 'All Deals',
    link: ''
  },
  {
    label: 'Drafts',
    link: 'drafts'
  },
  {
    label: 'Listings',
    link: 'listings'
  },
  {
    label: 'Pending',
    link: 'pendings'
  },
  {
    label: 'Archive',
    link: 'archives'
  }
]

interface Props {
  deals: IDeal[]
  activeFilter: string
  searchCriteria: string
  sortableColumns: SortableColumn[]
}

const TabFilters = withRouter((props: Props & WithRouterProps) => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }: IAppState) => user)
  const activeSort = getActiveSort(user, props.location, SORT_FIELD_SETTING_KEY)

  const handleChangeSort = async (column: SortableColumn) => {
    props.router.push(
      `${props.location.pathname}?sortBy=${column.value}&sortType=${
        column.ascending ? 'asc' : 'desc'
      }`
    )

    const fieldValue = column.ascending ? column.value : `-${column.value}`

    await putUserSetting(SORT_FIELD_SETTING_KEY, fieldValue)
    dispatch(getUserTeams(user))
  }

  return (
    <PageTabs
      defaultValue={props.params.filter || 'all'}
      tabs={TAB_ITEMS.map(({ label, link }, index: number) => {
        const url = link ? `${BASE_URL}/filter/${link}` : BASE_URL
        const urlWithQuery = `${url}${props.location.search}`

        return (
          <TabLink
            key={index}
            value={link || 'all'}
            label={<span>{label}</span>}
            to={urlWithQuery}
          />
        )
      })}
      actions={[
        <Tab
          key={0}
          label={
            <DropdownTab
              title={getGridSortLabel(
                user,
                SORTABLE_COLUMNS,
                props.location,
                SORT_FIELD_SETTING_KEY
              )}
            >
              {({ toggleMenu }) => (
                <>
                  {props.sortableColumns.map((column, index) => (
                    <MenuItem
                      key={index}
                      selected={
                        activeSort?.id === column.value &&
                        activeSort?.ascending === column.ascending
                      }
                      onClick={() => {
                        toggleMenu()
                        handleChangeSort(column)
                      }}
                    >
                      {column.label}
                    </MenuItem>
                  ))}
                </>
              )}
            </DropdownTab>
          }
        />
      ]}
    />
  )
})

export default TabFilters
