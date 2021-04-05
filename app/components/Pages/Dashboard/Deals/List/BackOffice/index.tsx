import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WithRouterProps } from 'react-router'
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect'
import { makeStyles, createStyles, Theme } from '@material-ui/core'

import { IAppState } from 'reducers/index'

import PageLayout from 'components/GlobalPageLayout'

import { searchDeals, getDeals } from 'actions/deals'
import { useBrandStatuses } from 'hooks/use-brand-statuses'
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

  const statuses = useBrandStatuses(getActiveTeamId(user)!)

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
    if (searchQuery.type === 'query' && statuses.length > 0) {
      dispatch(searchDeals(user, getStaticFilterQuery(searchQuery, statuses)))
    }
  }, [dispatch, searchQuery, statuses, user])

  const brand = getActiveTeamId(user)

  const [ analytics, setAnalytics ] = useState()

  useEffect(async () => {
    const data = new TextEncoder().encode(user.access_token)
    const crypted = await crypto.subtle.digest('SHA-512', data)
    const hash = Array.from(new Uint8Array(crypted))
    const hex = hash.map(b => b.toString(16).padStart(2, '0')).join('')

    const base = `https://metabase.rechat.com/public/dashboard/9964058b-c7c3-445a-95d1-b47eac657a87`

    setAnalytics(`${base}?brand=${brand}&token=${hex}#hide_parameters=token,brand&titled=false`)
  }, [user.access_token, brand])

  const frame = useRef()

  const analyticsLoaded = () => {
    if (!frame.current.contentDocument)
      return

    const style = frame.current.contentDocument.createElement('style')
    style.innerHTML = '.EmbedFrame-footer { display: none; }'

    frame.current.contentDocument.body.appendChild(style)
  }

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
        { analytics &&
          <iframe
            ref={frame}
            onLoad={ analyticsLoaded }
            src={analytics}
            frameBorder="0"
            width="100%"
            height="700"
            allowtransparency>
          </iframe>
        }
        <div className={classes.filtersContainer}>
          <TabFilters
            deals={deals}
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
