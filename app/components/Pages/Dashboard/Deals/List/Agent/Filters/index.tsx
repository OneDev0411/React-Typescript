import React from 'react'
import { withRouter, WithRouterProps } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

import { MenuItem } from '@material-ui/core'

import { IAppState } from 'reducers'

import { getStatus } from 'models/Deal/helpers/context'

import { putUserSetting } from 'models/user/put-user-setting'
import { getUserTeams } from 'actions/user/teams'

import { SortableColumn } from 'components/Grid/Table/types'
import { PageTabs, Tab, TabLink, DropdownTab } from 'components/PageTabs'

import {
  SORTABLE_COLUMNS,
  SORT_FIELD_SETTING_KEY
} from '../helpers/agent-sorting'
import { getGridSortLabel } from '../../helpers/sorting'

const BASE_URL = '/dashboard/deals'

const FilterNames = {
  Active: ['Active', 'Lease', 'Coming Soon'],
  Drafts: ['Drafts'],
  Pending: [
    'Active Contingent',
    'Active Kick Out',
    'Active Option Contract',
    'Lease Contract',
    'Pending'
  ],
  Archive: [
    'Sold',
    'Temp Off Market',
    'Expired',
    'Cancelled',
    'Withdrawn',
    'Leased',
    'Contract Terminated'
  ]
}

export const Filters = {
  all: (deal: IDeal) => !deal.deleted_at,
  drafts: (deal: IDeal) => deal.is_draft === true,
  listings: (deal: IDeal) =>
    FilterNames.Active.includes(getStatus(deal)) &&
    !deal.is_draft &&
    !deal.deleted_at,
  pendings: (deal: IDeal) =>
    FilterNames.Pending.includes(getStatus(deal)) &&
    !deal.is_draft &&
    !deal.deleted_at,
  archives: (deal: IDeal, statuses: IDealStatus[] = []) => {
    if (deal.deleted_at) {
      return true
    }

    const status = statuses.find(item => item.label === getStatus(deal))

    return status && status.archived === true
  }
}

const TAB_ITEMS = [
  {
    label: 'All Deals',
    filter: Filters.all,
    link: ''
  },
  {
    label: 'Drafts',
    filter: Filters.drafts,
    link: 'drafts'
  },
  {
    label: 'Listings',
    filter: Filters.listings,
    link: 'listings'
  },
  {
    label: 'Pending',
    filter: Filters.pendings,
    link: 'pendings'
  },
  {
    label: 'Archive',
    filter: Filters.archives,
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
