import { makeStyles, Theme } from '@material-ui/core'
import { WithRouterProps } from 'react-router'

import { useQueryParam } from '@app/hooks/use-query-param'
import PageLayout from 'components/GlobalPageLayout'
import { useActiveBrandId } from 'hooks/brand/use-active-brand-id'
import { useBrandStatuses } from 'hooks/use-brand-statuses'

import { ExportDeals } from '../components/ExportDeals'
import { DebouncedSearchInput } from '../components/SearchInput'

import TabFilters from './Filters'
import Grid from './Grid'
import { SORTABLE_COLUMNS } from './helpers/backoffice-sorting'
import { useSearchQuery } from './hooks/use-search-query'
import { SearchQuery } from './types'

const useStyles = makeStyles(
  (theme: Theme) => ({
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
  }),
  { name: 'BackofficeTable' }
)

export default function BackofficeTable(props: WithRouterProps) {
  const classes = useStyles()
  const activeBrandId = useActiveBrandId()

  const [statuses] = useBrandStatuses(activeBrandId)
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

        <Grid searchQuery={searchQuery} statuses={statuses} />
      </PageLayout.Main>
    </PageLayout>
  )
}
