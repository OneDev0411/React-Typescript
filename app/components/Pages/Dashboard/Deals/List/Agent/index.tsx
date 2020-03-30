import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { WithRouterProps } from 'react-router'
import useDebouncedCallback from 'use-debounce/lib/callback'
import { makeStyles, createStyles, Theme } from '@material-ui/core'

import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'

import { searchDeals, getDeals } from 'actions/deals'
import { viewAsEveryoneOnTeam, viewAs } from 'utils/user-teams'

import GlobalHeader from 'components/GlobalHeader'
import { SearchInput } from 'components/GlobalHeaderWithSearch'

import { IAppState } from 'reducers'

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
  const [searchCriteria, setSearchCriteria] = useState('')
  const classes = useStyles()

  const dispatch = useDispatch()
  const { deals, user, isFetchingDeals, viewAsUsers } = useSelector(
    ({ deals, user }: IAppState) => ({
      user,
      deals: deals.list,
      isFetchingDeals: deals.properties.isFetchingDeals,
      viewAsUsers: viewAs(user)
    })
  )

  const handleQueryChange = e => {
    if (isFetchingDeals) {
      return
    }

    const { value } = e.target

    setSearchCriteria(value)
    debouncedFetch(user, value)
  }

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

  const [debouncedFetch] = useDebouncedCallback(fetch, 500)

  useDeepCompareEffect(() => {
    fetch(user, searchCriteria)
  }, [viewAsUsers])

  return (
    <div className={classes.container}>
      <GlobalHeader title="My deals" noPadding>
        <div className={classes.headerContainer}>
          <SearchInput
            placeholder="Search deals by address, MLS# or agent name..."
            onChange={handleQueryChange}
          />

          <ExportDeals />
        </div>
      </GlobalHeader>

      <div className={classes.filtersContainer}>
        <TabFilters
          deals={deals}
          activeFilter={props.params.filter}
          searchCriteria={searchCriteria}
          sortableColumns={SORTABLE_COLUMNS}
        />
      </div>

      <Grid
        activeFilter={props.params.filter}
        sortableColumns={SORTABLE_COLUMNS}
      />
    </div>
  )
}
