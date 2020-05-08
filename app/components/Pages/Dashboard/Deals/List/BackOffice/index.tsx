import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WithRouterProps } from 'react-router'
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'
import { makeStyles, createStyles, Theme } from '@material-ui/core'

import { IAppState } from 'reducers/index'

import PageLayout from 'components/GlobalPageLayout'

import { searchDeals, getDeals } from 'actions/deals'
import { useDealStatuses } from 'hooks/use-deal-statuses'
import { getActiveTeamId } from 'utils/user-teams'

import TabFilters from './Filters'

import { SORTABLE_COLUMNS } from './helpers/backoffice-sorting'

import { ExportDeals } from '../components/ExportDeals'
import { DebouncedSearchInput } from '../components/SearchInput'

import { SearchQuery } from './types'

import { getStaticFilterQuery } from './utils/get-static-filter-query'

import Grid from './Grid'

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

  const statuses = useDealStatuses(getActiveTeamId(user)!)

  const [searchCriteria, setSearchCriteria] = useState('')
  const searchQuery: SearchQuery = {
    filter: props.params.filter,
    type: props.location.query.type || 'inbox',
    term: searchCriteria
  }

  const handleQueryChange = (value): void => {
    setSearchCriteria(value)

    if (value.length === 0) {
      dispatch(getDeals(user))
    }

    if (value.length > 3 && searchQuery.type === 'inbox') {
      dispatch(searchDeals(user, value))
    }
  }

  useDeepCompareEffect(() => {
    if (searchQuery.type === 'query') {
      dispatch(searchDeals(user, getStaticFilterQuery(searchQuery, statuses)))
    }
  }, [searchQuery])

  return (
    <PageLayout>
      <PageLayout.Header title="Deals Admin">
        <div className={classes.headerContainer}>
          <DebouncedSearchInput
            placeholder="Search deals by address, MLS# or agent name..."
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
            searchQuery={searchQuery}
            sortableColumns={SORTABLE_COLUMNS}
          />
        </div>

        <Grid searchQuery={searchQuery} />
      </PageLayout.Main>
    </PageLayout>
  )
}
