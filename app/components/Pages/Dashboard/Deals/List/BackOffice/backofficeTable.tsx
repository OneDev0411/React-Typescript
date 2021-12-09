import { useSelector } from 'react-redux'
import { WithRouterProps } from 'react-router'

import { selectUser } from '@app/selectors/user'
import { goTo } from '@app/utils/go-to'
import PageLayout from 'components/GlobalPageLayout'
import { useBrandStatuses } from 'hooks/use-brand-statuses'
import { getActiveTeamId } from 'utils/user-teams'

import { ExportDeals } from '../components/ExportDeals'
import { DebouncedSearchInput } from '../components/SearchInput'

import Grid from './Grid'
import { SORTABLE_COLUMNS } from './helpers/backoffice-sorting'
import { useStyles } from './styles'
import TabFilters from './TabFilters'
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

  // Redirect to Search tab onClick on the search box
  const redirectToSearchTab = () => {
    goTo('/dashboard/deals/filter/search?type=query')
  }

  return (
    <PageLayout>
      <PageLayout.Header title="Deals Admin">
        <div className={classes.headerContainer}>
          {
            // The search box on this page is readonly and does not work actually.
            // We redirect to the Search tab when users click the search box,
            // so users can see the results in an appropriate tab
          }
          <DebouncedSearchInput
            onClick={redirectToSearchTab}
            placeholder="Search deals by address, MLS# or agent name..."
            value=""
            InputProps={{ readOnly: true }}
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
