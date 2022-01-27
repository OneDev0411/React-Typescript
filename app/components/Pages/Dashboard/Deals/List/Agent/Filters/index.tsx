import { makeStyles, MenuItem } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'

import { getUserTeams } from 'actions/user/teams'
import { SortableColumn } from 'components/Grid/Table/types'
import { PageTabs, Tab, TabLink, DropdownTab } from 'components/PageTabs'
import { putUserSetting } from 'models/user/put-user-setting'
import { selectUser } from 'selectors/user'
import { getActiveBrand } from 'utils/user-teams'

import AnalyticsDropdownTab from '../../../Analytics/DropdownTab'
import { Notification } from '../../components/Notification'
import { getGridSortLabel, getActiveSort } from '../../helpers/sorting'
import {
  SORTABLE_COLUMNS,
  SORT_FIELD_SETTING_KEY
} from '../helpers/agent-sorting'
import { useDealsList } from '../hooks/use-deals-list'

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

const useStyles = makeStyles(
  () => ({
    notification: {
      top: 0,
      right: 0,
      position: 'relative',
      display: 'inline-block'
    }
  }),
  {
    name: 'DealsGridAgentFilters'
  }
)

interface Props {
  deals: IDeal[]
  activeFilter: string
  sortableColumns: SortableColumn[]
}

const TabFilters = withRouter((props: Props & WithRouterProps) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const user = useSelector(selectUser)
  const activeSort = getActiveSort(user, props.location, SORT_FIELD_SETTING_KEY)
  const getDealsList = useDealsList()

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

  const activeBrand = getActiveBrand(user)

  return (
    <PageTabs
      defaultValue={props.params.filter || 'all'}
      tabs={[
        ...TAB_ITEMS.map(({ label, link }, index: number) => {
          const url = link ? `${BASE_URL}/filter/${link}` : BASE_URL
          const urlWithQuery = `${url}${props.location.search}`
          const deals = getDealsList(link ?? 'all')
          const notificationsCount = deals.reduce(
            (counter, deal) =>
              deal.new_notifications?.length
                ? counter + deal.new_notifications.length
                : counter,
            0
          )

          return (
            <TabLink
              key={index}
              value={link || 'all'}
              label={
                <span>
                  {label}{' '}
                  {notificationsCount > 0 && (
                    <Notification
                      count={notificationsCount}
                      className={classes.notification}
                    />
                  )}
                </span>
              }
              to={urlWithQuery}
            />
          )
        })
      ]}
      actions={[
        <AnalyticsDropdownTab key={0} brandType={activeBrand?.brand_type!} />,
        <Tab
          key={1}
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
