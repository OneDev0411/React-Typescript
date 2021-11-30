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
import { SORTABLE_COLUMNS } from './helpers/backoffice-sorting'
import { useStyles } from './styles'
import { SearchQuery, StateProps } from './types'

export function AllDealsTable(props: WithRouterProps & StateProps) {
  const classes = useStyles()
  const user = useSelector(selectUser)

  const [statuses] = useBrandStatuses(getActiveTeamId(user)!)
  const [searchCriteria, setSearchCriteria] = useQueryParam('q')

  const searchQuery: SearchQuery = {
    filter: props.params.filter,
    type: props.location.query.type || 'inbox',
    term: searchCriteria || ''
  }

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

        <AllDealsPage searchQuery={searchQuery} statuses={statuses} />
      </PageLayout.Main>
    </PageLayout>
  )
}
