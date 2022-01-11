import { MenuItem } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { setActiveTeamSetting } from '@app/store_actions/active-team'
import { SortableColumn } from 'components/Grid/Table/types'
import { PageTabs, Tab, TabLink, DropdownTab } from 'components/PageTabs'

import AnalyticsDropdownTab from '../../../Analytics/DropdownTab'
import { getGridSortLabel, getActiveSort } from '../../helpers/sorting'
import {
  SORTABLE_COLUMNS,
  SORT_FIELD_SETTING_KEY
} from '../helpers/agent-sorting'

const BASE_URL = '/dashboard/deals'

const TAB_ITEMS = [
  {
    label: 'All Deals',
    link: ''
  },
  {
    label: 'Draft',
    link: 'drafts'
  },
  {
    label: 'Active',
    link: 'actives'
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
  sortableColumns: SortableColumn[]
}

const TabFilters = withRouter((props: Props & WithRouterProps) => {
  const dispatch = useDispatch()
  const activeTeam = useUnsafeActiveTeam()

  const activeSort = getActiveSort(
    activeTeam,
    props.location,
    SORT_FIELD_SETTING_KEY
  )

  const handleChangeSort = async (column: SortableColumn) => {
    props.router.push(
      `${props.location.pathname}?sortBy=${column.value}&sortType=${
        column.ascending ? 'asc' : 'desc'
      }`
    )

    const fieldValue = column.ascending ? column.value : `-${column.value}`

    dispatch(setActiveTeamSetting(SORT_FIELD_SETTING_KEY, fieldValue))
  }

  return (
    <PageTabs
      defaultValue={props.params.filter || 'all'}
      tabs={[
        ...TAB_ITEMS.map(({ label, link }, index: number) => {
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
        })
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
              title={getGridSortLabel(
                activeTeam,
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
