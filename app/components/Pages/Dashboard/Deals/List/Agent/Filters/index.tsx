import React from 'react'
import { withRouter, WithRouterProps } from 'react-router'

import { MenuItem } from '@material-ui/core'

import { getStatus } from 'models/Deal/helpers/context'

import { SortableColumn } from 'components/Grid/Table/types'
import { PageTabs, Tab, TabLink, DropdownTab } from 'components/PageTabs'

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
  archives: (deal: IDeal) =>
    FilterNames.Archive.includes(getStatus(deal)) || !!deal.deleted_at
}

const TAB_ITEMS = [
  {
    label: 'All',
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
  const handleChangeSort = (column: SortableColumn) => {
    props.router.push(
      `${props.location.pathname}?sortBy=${column.value}&sortType=${
        column.ascending ? 'asc' : 'desc'
      }`
    )
  }

  const getSortTitle = () => {
    const defaultValue = 'A - Z'

    if (!props.location.search) {
      return defaultValue
    }

    const column = props.sortableColumns.find(
      col => col.value === props.location.query.sortBy
    )

    return column ? column.label! : defaultValue
  }

  return (
    <PageTabs
      defaultValue={props.params.id || 'All'}
      tabs={TAB_ITEMS.map(({ label, link }, index: number) => {
        const url = link ? `${BASE_URL}/filter/${link}` : BASE_URL
        const urlWithQuery = `${url}${props.location.search}`

        return (
          <TabLink
            key={index}
            value={link || 'All'}
            label={<span>{label}</span>}
            to={urlWithQuery}
          />
        )
      })}
      actions={[
        <Tab
          key={0}
          label={
            <DropdownTab title={getSortTitle()}>
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
