import { useDispatch, useSelector } from 'react-redux'
import { WithRouterProps } from 'react-router'
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'
import { makeStyles, createStyles, Theme } from '@material-ui/core'

import { useQueryParam } from '@app/hooks/use-query-param'

import { IAppState } from 'reducers/index'

import PageLayout from 'components/GlobalPageLayout'

import { searchDeals, getDeals } from 'actions/deals'
import { useBrandStatuses } from 'hooks/use-brand-statuses'
import { getActiveTeamId } from 'utils/user-teams'

import TabFilters from './Filters'

import { SORTABLE_COLUMNS } from './helpers/backoffice-sorting'

import { ExportDeals } from '../components/ExportDeals'
import { DebouncedSearchInput } from '../components/SearchInput'

import { SearchQuery } from './types'

import { getStaticFilterQuery } from './utils/get-static-filter-query'

import Grid from './Grid'
import { getClosingsFilterQuery } from '../helpers/closings'

interface StateProps {
  user: IUser
  isFetchingDeals: boolean
  getDeals(user: IUser): void
  searchDeals(user: IUser, value: object | string): void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(5)
    },
    headerContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end'
    },
    filtersContainer: {
      margin: theme.spacing(5, 0)
    }
  })
)

export default function BackofficeTable(props: WithRouterProps & StateProps) {
  const classes = useStyles()

  const dispatch = useDispatch()
  const { user, deals } = useSelector(({ user, deals }: IAppState) => ({
    user,
    deals: deals.list
  }))

  const statuses = useBrandStatuses(getActiveTeamId(user)!)
  const [searchCriteria, setSearchCriteria] = useQueryParam('q')

  const searchQuery: SearchQuery = {
    filter: props.params.filter,
    type: props.location.query.type || 'inbox',
    term: searchCriteria || ''
  }

  /**
   * The inbox tabs call /brands/${brandId}/deals/inbox API then the grid component
   * filters the result on the frontend side. So all of them need just one API call.
   * Other tabs need to call /deals/filter API with their specific filters.
   * This means we don't need to call the API on every tab change.
   * The listKey variable helps this component to be smart and call the APIs at the
   * right time.
   */
  const listKey =
    searchQuery.type === 'inbox'
      ? searchQuery.type
      : [searchQuery.type, searchQuery.filter].join('-')

  useDeepCompareEffect(() => {
    if (searchQuery.type === 'query') {
      if (searchQuery.filter === 'closings') {
        dispatch(searchDeals(user, getClosingsFilterQuery(searchQuery.term)))
      } else if (statuses.length > 0) {
        dispatch(searchDeals(user, getStaticFilterQuery(searchQuery, statuses)))
      }
    } else if (searchQuery.type === 'inbox') {
      if (!searchQuery.term) {
        dispatch(getDeals(user))
      } else {
        dispatch(searchDeals(user, searchQuery.term))
      }
    }
  }, [
    listKey,
    searchQuery.term, // This dependency leads to call the API on every term changes
    statuses,
    user
  ])

  return (
    <PageLayout>
      <PageLayout.Header title="Deals Admin">
        <div className={classes.headerContainer}>
          <DebouncedSearchInput
            placeholder="Search deals by address, MLS# or agent name..."
            value={searchCriteria}
            onChange={setSearchCriteria}
          />

          <ExportDeals />
        </div>
      </PageLayout.Header>
      <PageLayout.Main>
        <div className={classes.filtersContainer}>
          <TabFilters
            deals={deals}
            activeFilter={props.params.filter}
            searchQuery={searchQuery}
            sortableColumns={SORTABLE_COLUMNS}
          />
        </div>

        <Grid searchQuery={searchQuery} statuses={statuses} />
      </PageLayout.Main>
    </PageLayout>
  )
}
