import { makeStyles, createStyles, Theme } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { WithRouterProps } from 'react-router'

import { useQueryParam } from '@app/hooks/use-query-param'
import { selectUser } from '@app/selectors/user'
import PageLayout from 'components/GlobalPageLayout'
import { useBrandStatuses } from 'hooks/use-brand-statuses'
import { getActiveTeamId } from 'utils/user-teams'

import { ExportDeals } from '../components/ExportDeals'
import { DebouncedSearchInput } from '../components/SearchInput'

import AllDealsPage from './AllDealsPage'
import TabFilters from './Filters'
import Grid from './Grid'
import { SORTABLE_COLUMNS } from './helpers/backoffice-sorting'
import { useSearchQuery } from './hooks/use-search-query'
import { SearchQuery } from './types'

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
  const user = useSelector(selectUser)

  const [statuses] = useBrandStatuses(getActiveTeamId(user)!)
  const [searchCriteria, setSearchCriteria] = useQueryParam('q')

  const searchQuery: SearchQuery = {
    filter: props.params.filter,
    type: props.location.query.type || 'inbox',
    term: searchCriteria || ''
  }

  useSearchQuery(searchQuery, statuses)

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
            activeFilter={props.params.filter}
            searchQuery={searchQuery}
            sortableColumns={SORTABLE_COLUMNS}
          />
        </div>

        {/* Added new filters for all deals tab */}
        {props.params.filter === 'all' ? (
          <AllDealsPage searchQuery={searchQuery} statuses={statuses} />
        ) : (
          <Grid searchQuery={searchQuery} statuses={statuses} />
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}
