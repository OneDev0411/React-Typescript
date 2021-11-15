import { MenuItem } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'

import { getUserTeams } from 'actions/user/teams'
import { SortableColumn } from 'components/Grid/Table/types'
import { PageTabs, Tab, TabLink, DropdownTab } from 'components/PageTabs'
import { getActiveSort, getGridSortLabel } from 'deals/List/helpers/sorting'
import { putUserSetting } from 'models/user/put-user-setting'
import { selectUser } from 'selectors/user'
import { getActiveBrand } from 'utils/user-teams'

import AnalyticsDropdownTab from '../../../Analytics/DropdownTab'
import {
  SORTABLE_COLUMNS,
  SORT_FIELD_SETTING_KEY
} from '../helpers/backoffice-sorting'
import { useDefaultTab } from '../hooks/use-default-tab'
import { useInboxTabs } from '../hooks/use-inbox-tabs'
import { SearchQuery } from '../types'

interface Props {
  activeFilter: string
  searchQuery: SearchQuery
  sortableColumns: SortableColumn[]
}

const TabFilters = withRouter((props: Props & WithRouterProps) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const activeSort = getActiveSort(user, props.location, SORT_FIELD_SETTING_KEY)

  const inboxTabs = useInboxTabs()

  const defaultTab = Array.isArray(inboxTabs) ? inboxTabs[0] : null

  useDefaultTab(props.params || {}, defaultTab)

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

  // The closings filter uses query type but it is not included in the static filters.
  const staticFiltersTitle =
    props.location.query.type === 'query' && props.params.filter !== 'closings'
      ? `All ${props.params.filter} deals`
      : 'All Deals'

  const activeBrand = getActiveBrand(user)

  return (
    <PageTabs
      value={
        props.location.query.type === 'query' &&
        ['listing', 'contract'].includes(props.params.filter)
          ? 'all-deals'
          : null
      }
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
        <TabLink
          key="closings"
          value="closings"
          label={<span>Upcoming Closings</span>}
          to="/dashboard/deals/filter/closings?type=query"
        />,
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
