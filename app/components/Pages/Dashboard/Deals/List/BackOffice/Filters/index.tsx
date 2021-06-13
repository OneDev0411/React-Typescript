import { useEffect } from 'react'
import { withRouter, WithRouterProps } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { MenuItem } from '@material-ui/core'
import _ from 'underscore'

import { putUserSetting } from 'models/user/put-user-setting'
import { getUserTeams } from 'actions/user/teams'
import { getActiveBrand } from 'utils/user-teams'
import { getActiveSort } from 'deals/List/helpers/sorting'

import { SortableColumn } from 'components/Grid/Table/types'

import { PageTabs, Tab, TabLink, DropdownTab } from 'components/PageTabs'

import { selectUser } from 'selectors/user'

import AnalyticsDropdownTab from '../../../Analytics/DropdownTab'

import {
  SORTABLE_COLUMNS,
  SORT_FIELD_SETTING_KEY
} from '../helpers/backoffice-sorting'
import { getGridSortLabel } from '../../helpers/sorting'

import { SearchQuery } from '../types'

interface Props {
  deals: IDeal[]
  activeFilter: string
  searchQuery: SearchQuery
  sortableColumns: SortableColumn[]
}

const TabFilters = withRouter((props: Props & WithRouterProps) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const activeSort = getActiveSort(user, props.location, SORT_FIELD_SETTING_KEY)
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

  const handleChangeSort = async (column: SortableColumn) => {
    props.router.push(
      `${props.location.pathname}?type=${props.searchQuery.type}&sortBy=${
        column.value
      }&sortType=${column.ascending ? 'asc' : 'desc'}`
    )

    const fieldValue = column.ascending ? column.value : `-${column.value}`

    await putUserSetting(SORT_FIELD_SETTING_KEY, fieldValue)

    dispatch(getUserTeams(user))
  }

  const staticFiltersTitle =
    props.location.query.type === 'query'
      ? `All ${props.params.filter} deals`
      : 'All Deals'

  const activeBrand = getActiveBrand(user)

  return (
    <PageTabs
      value={props.location.query.type === 'query' ? 'all-deals' : null}
      defaultValue={props.params.filter}
      tabs={[
        ...inboxTabs
          .filter(name => !!name)
          .map((name, index) => (
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
            <DropdownTab component="div" title={staticFiltersTitle}>
              {({ toggleMenu }) => (
                <>
                  <MenuItem
                    key={0}
                    selected={
                      props.params.filter === 'listing' &&
                      props.location.query.type === 'query'
                    }
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
                    selected={
                      props.params.filter === 'contract' &&
                      props.location.query.type === 'query'
                    }
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
        <AnalyticsDropdownTab key={0} brandType={activeBrand?.brand_type!} />,
        <Tab
          key={1}
          label={
            <DropdownTab
              component="div"
              title={getGridSortLabel(
                user,
                SORTABLE_COLUMNS,
                props.location,
                SORT_FIELD_SETTING_KEY
              )}
              tooltipOptions={{
                title: 'Sort by',
                placement: 'top'
              }}
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
