import { WithRouterProps } from 'react-router'

import { useQueryParam } from '@app/hooks/use-query-param'
import { goTo } from '@app/utils/go-to'
import PageLayout from 'components/GlobalPageLayout'

import { DebouncedSearchInput } from '../components/SearchInput'

import { SORTABLE_COLUMNS } from './helpers/backoffice-sorting'
import { OtherTabsWrapper } from './otherTabsWrapper'
import { SearchTabWrapper } from './searchTabWrapper'
import { useStyles } from './styles'
import TabFilters from './TabFilters'
import { SearchQuery } from './types'

export default function BackofficeWraperPage(props: WithRouterProps) {
  const classes = useStyles()

  const [searchCriteria, setSearchCriteria] = useQueryParam('q')
  const isSearchTab = props.params.filter === 'search'

  const searchQuery: SearchQuery = {
    filter: props.params.filter,
    type: props.location.query.type || 'inbox',
    term: !isSearchTab || !searchCriteria ? '' : searchCriteria
  }

  // Redirect to Search tab onClick on the search box on other tabs
  const redirectToSearchTab = () => {
    goTo('/dashboard/deals/filter/search?type=query')
  }

  return (
    <PageLayout>
      <PageLayout.Header title="Deals Admin">
        <div className={classes.headerContainer}>
          {
            // The search box on other tab should be readonly.
            // We redirect to the Search tab when users click the search box,
            // so users can see the results in an appropriate tab
          }
          {isSearchTab ? (
            <DebouncedSearchInput
              placeholder="Search deals by address, MLS# or agent name..."
              value={searchCriteria}
              onChange={setSearchCriteria}
              autoFocus
            />
          ) : (
            <div>
              <DebouncedSearchInput
                onClick={redirectToSearchTab}
                placeholder="Search deals by address, MLS# or agent name..."
                value=""
                InputProps={{ readOnly: true }}
              />
            </div>
          )}
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
        {isSearchTab ? (
          <SearchTabWrapper searchQuery={searchQuery} />
        ) : (
          <OtherTabsWrapper searchQuery={searchQuery} />
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}
