import React, { useEffect } from 'react'
import { withRouter, WithRouterProps } from 'react-router'
import _ from 'underscore'

import { MenuItem } from '@material-ui/core'

import { SortableColumn } from 'components/Grid/Table/types'
import { PageTabs, Tab, TabLink, DropdownTab } from 'components/PageTabs'

import { SearchQuery } from '../types'

interface Props {
  deals: IDeal[]
  activeFilter: string
  searchQuery: SearchQuery
  sortableColumns: SortableColumn[]
}

const TabFilters = withRouter((props: Props & WithRouterProps) => {
  const inboxTabs = _.chain(props.deals)
    .pluck('inboxes')
    .flatten()
    .uniq()
    .filter(tab => tab !== null)
    .value()

  useEffect(() => {
    if (!props.params.filter && inboxTabs.length > 0) {
      props.router.push(`/dashboard/deals/filter/${inboxTabs[0]}`)
    }
  }, [inboxTabs, props.params.filter, props.router])

  const handleChangeSort = (column: SortableColumn) => {
    props.router.push(
      `${props.location.pathname}?type=${props.searchQuery.type}&sortBy=${
        column.value
      }&sortType=${column.ascending ? 'asc' : 'desc'}`
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

  const staticFiltersTitle =
    props.location.query.type === 'query'
      ? `All ${props.params.filter} deals`
      : 'All Deals'

  return (
    <PageTabs
      value={props.location.query.type === 'query' ? 'all-deals' : null}
      defaultValue={props.params.filter}
      tabs={[
        ...inboxTabs.map((name, index) => (
          <TabLink
            key={index}
            value={name}
            label={<span>{name}</span>}
            to={`/dashboard/deals/filter/${name}?type=inbox`}
          />
        )),
        <Tab
          key={inboxTabs.length + 1}
          value="all-deals"
          label={
            <DropdownTab title={staticFiltersTitle}>
              {({ toggleMenu }) => (
                <>
                  <MenuItem
                    key={0}
                    onClick={() => {
                      toggleMenu()
                      props.router.push(
                        '/dashboard/deals/filter/listing?type=query'
                      )
                    }}
                  >
                    All Listings Deals
                  </MenuItem>

                  <MenuItem
                    key={1}
                    onClick={() => {
                      toggleMenu()
                      props.router.push(
                        '/dashboard/deals/filter/contract?type=query'
                      )
                    }}
                  >
                    All Contract Deals
                  </MenuItem>
                </>
              )}
            </DropdownTab>
          }
        />
      ]}
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
