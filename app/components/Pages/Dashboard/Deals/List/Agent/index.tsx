import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { WithRouterProps } from 'react-router'
import { makeStyles, createStyles, Theme } from '@material-ui/core'

import { useEffectOnce } from 'react-use'

import { IAppState } from 'reducers'

import { searchDeals, getDeals } from 'actions/deals'
import { viewAsEveryoneOnTeam } from 'utils/user-teams'

import PageLayout from 'components/GlobalPageLayout'

import { selectUser } from 'selectors/user'

import { useQueryParam } from '@app/hooks/use-query-param'

import { DebouncedSearchInput } from '../components/SearchInput'

import { SORTABLE_COLUMNS } from './helpers/agent-sorting'

import Grid from './Grid'
import TabFilters from './Filters'
import { ExportDeals } from '../components/ExportDeals'

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
      if (searchCriteria.length === 0 && viewAsEveryoneOnTeam(user)) {
        dispatch(getDeals(user))
      } else {
        dispatch(searchDeals(user, searchCriteria))
      }
    },
    [dispatch]
  )

  useEffectOnce(() => {
    if (searchCriteria.length > 0) {
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
