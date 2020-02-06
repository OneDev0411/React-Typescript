import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WithRouterProps } from 'react-router'
import { Grid, Theme, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'

import Loading from 'partials/Loading'

import setSelectedEmailThreadId from './helpers/set-selected-email-thread-id'
import InboxHeader, { InboxFilterTabCode } from './components/InboxHeader'
import InboxConnectAccount from './components/InboxConnectAccount'
import InboxEmailThreadList from './components/InboxEmailThreadList'
import InboxEmailThread from './components/InboxEmailThread'

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    height: 'calc(100% - 109px - 49px)'
  },
  fullHeight: {
    height: '100%'
  },
  list: {
    width: theme.spacing(46) + 1 /* right border */ + 8 /* scroll bar */
  },
  conversation: {
    overflowX: 'hidden',
    overflowY: 'auto',
    borderLeft: '1px solid #d4d4d4'
  },
  conversationNoBorder: {
    borderLeft: 0
  }
}))

interface Props {}

export default function Inbox({ params }: Props & WithRouterProps) {
  const accounts = useSelector<IAppState, IOAuthAccount[]>(
    ({ contacts: { oAuthAccounts } }) =>
      selectAllConnectedAccounts(oAuthAccounts)
  )
  const noConnectedAccounts = accounts.length === 0

  const [initializing, setInitializing] = useState<boolean>(true)
  const [filterTabCode, setFilterTabCode] = useState<InboxFilterTabCode>(
    'all_emails'
  )

  const dispatch = useDispatch()

  useEffectOnce(() => {
    dispatch(fetchOAuthAccounts()).then(() => setInitializing(false))
  })

  const classes = useStyles()

  return (
    <>
      <InboxHeader
        filterTabsDisabled={initializing || noConnectedAccounts}
        filterTabCode={filterTabCode}
        onFilterTabChange={filterTabCode => {
          setSelectedEmailThreadId(undefined)
          setFilterTabCode(filterTabCode)
        }}
      />
      <div className={classes.body}>
        {initializing ? (
          <Box paddingTop={2}>
            <Loading />
          </Box>
        ) : noConnectedAccounts ? (
          <InboxConnectAccount />
        ) : (
          <Grid container spacing={0} classes={{ root: classes.fullHeight }}>
            <Grid
              item
              classes={{ root: classNames(classes.list, classes.fullHeight) }}
            >
              <InboxEmailThreadList
                category={
                  filterTabCode === 'all_emails'
                    ? 'all'
                    : filterTabCode === 'unread'
                    ? 'unread'
                    : filterTabCode === 'has_attachment'
                    ? 'has attachments'
                    : 'all'
                }
              />
            </Grid>
            <Grid
              item
              xs
              classes={{
                root: classNames(
                  classes.conversation,
                  // (!emailThreadListInnerRef.current || emailThreadListInnerRef.current.emailThreads.length === 0) && classes.conversationNoBorder,
                  classes.fullHeight
                )
              }}
            >
              <InboxEmailThread />
            </Grid>
          </Grid>
        )}
      </div>
    </>
  )
}
