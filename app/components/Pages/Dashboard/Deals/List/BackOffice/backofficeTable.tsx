import { useSelector } from 'react-redux'
import { WithRouterProps } from 'react-router'

import { selectUser } from '@app/selectors/user'
import PageLayout from 'components/GlobalPageLayout'
import { useBrandStatuses } from 'hooks/use-brand-statuses'
import { getActiveTeamId } from 'utils/user-teams'

import TabFilters from './Filters'
import Grid from './Grid'
import { SORTABLE_COLUMNS } from './helpers/backoffice-sorting'
import { useSearchQuery } from './hooks/use-search-query'
import { useStyles } from './styles'
import { SearchQuery, StateProps } from './types'

export function BackofficeTable(props: WithRouterProps & StateProps) {
  const classes = useStyles()
  const user = useSelector(selectUser)

  const [statuses] = useBrandStatuses(getActiveTeamId(user)!)

  const searchQuery: SearchQuery = {
    filter: props.params.filter,
    type: props.location.query.type || 'inbox',
    term: ''
  }

  useSearchQuery(searchQuery, statuses)

  return (
    <PageLayout>
      <PageLayout.Header title="Deals Admin" />
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
