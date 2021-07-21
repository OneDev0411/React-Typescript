import { useCallback } from 'react'

import { makeStyles, createStyles, Theme } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { WithRouterProps } from 'react-router'
import { useEffectOnce } from 'react-use'

import { useQueryParam } from '@app/hooks/use-query-param'
import { searchDeals, getDeals } from 'actions/deals'
import PageLayout from 'components/GlobalPageLayout'
import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'

import { ExportDeals } from '../components/ExportDeals'
import { DebouncedSearchInput } from '../components/SearchInput'

import TabFilters from './Filters'
import Grid from './Grid'
import { SORTABLE_COLUMNS } from './helpers/agent-sorting'

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

export default function AgentTable(props: WithRouterProps) {
  const classes = useStyles()
  const [searchCriteria, setSearchCriteria] = useQueryParam('q')

  const dispatch = useDispatch()
  const deals = useSelector(({ deals }: IAppState) => deals.list)
  const isFetchingDeals = useSelector(
    ({ deals }: IAppState) => deals.properties.isFetchingDeals
  )
  const user = useSelector(selectUser)

  const fetch = useCallback(
    (user: IUser, searchCriteria: string) => {
      dispatch(
        searchCriteria ? searchDeals(user, searchCriteria) : getDeals(user)
      )
    },
    [dispatch]
  )

  useEffectOnce(() => {
    if (searchCriteria.length > 0 && !isFetchingDeals) {
      fetch(user, searchCriteria)
    }
  })

  const handleQueryChange = (value: string) => {
    if (isFetchingDeals) {
      return
    }

    setSearchCriteria(value)
    fetch(user, value)
  }

  return (
    <PageLayout>
      <PageLayout.Header title="My deals">
        <div className={classes.headerContainer}>
          <DebouncedSearchInput
            placeholder="Search deals by address, MLS# or agent name..."
            value={searchCriteria}
            onChange={handleQueryChange}
          />

          <ExportDeals />
        </div>
      </PageLayout.Header>
      <PageLayout.Main>
        <div className={classes.filtersContainer}>
          <TabFilters
            deals={deals}
            activeFilter={props.params.filter}
            sortableColumns={SORTABLE_COLUMNS}
          />
        </div>

        <Grid
          activeFilter={props.params.filter}
          sortableColumns={SORTABLE_COLUMNS}
        />
      </PageLayout.Main>
    </PageLayout>
  )
}
