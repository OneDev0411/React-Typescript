import { MenuItem } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { useReplaceQueryParam } from '@app/hooks/use-query-param'
import { setActiveTeamSetting } from '@app/store_actions/active-team'
import { parseSortSetting } from '@app/utils/sortings/parse-sort-setting'
import { SortableColumn } from 'components/Grid/Table/types'
import { PageTabs, Tab, TabLink, DropdownTab } from 'components/PageTabs'
import { DEFAULT_SORT, getGridSortLabel } from 'deals/List/helpers/sorting'

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
  const activeTeam = useUnsafeActiveTeam()

  const activeTeamSort = parseSortSetting(
    activeTeam,
    SORT_FIELD_SETTING_KEY,
    DEFAULT_SORT
  )

  const [sortBy, setSortByParam] = useReplaceQueryParam('sortBy', '' as string)
  const [sortType, setSortTypeParam] = useReplaceQueryParam(
    'sortType',
    '' as string
  )

  const activeSort = sortBy
    ? {
        id: sortBy,
        ascending: sortType === 'asc'
      }
    : activeTeamSort

  const inboxTabs = useInboxTabs()

  const defaultTab = Array.isArray(inboxTabs) ? inboxTabs[0] : null

  useDefaultTab(props.params || {}, defaultTab)

  const handleChangeSort = async (column: SortableColumn) => {
    setSortByParam(column.value || '')

    setSortTypeParam(column.ascending ? 'asc' : 'desc')

    const fieldValue = column.ascending ? column.value : `-${column.value}`

    dispatch(setActiveTeamSetting(SORT_FIELD_SETTING_KEY, fieldValue))
  }

  return (
    <PageTabs
      value={props.params.filter}
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
        <TabLink
          key="search"
          value="search"
          label={<span>Search</span>}
          to="/dashboard/deals/filter/search?type=query"
        />
      ]}
      actions={[
        <AnalyticsDropdownTab
          key={0}
          brandType={activeTeam?.brand.brand_type}
        />,
        <Tab
          key={1}
          label={
            <DropdownTab
              component="div"
              title={getGridSortLabel(
                activeTeam,
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
