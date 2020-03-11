import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WithRouterProps } from 'react-router'
import { Grid, Theme, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'

import GlobalPageLayout from 'components/GlobalPageLayout'

import setSelectedEmailThreadId from './helpers/set-selected-email-thread-id'
import InboxConnectAccount from './components/InboxConnectAccount'
import InboxEmailThreadList from './components/InboxEmailThreadList'
import InboxEmailThread from './components/InboxEmailThread'

const useStyles = makeStyles(
  (theme: Theme) => ({
    layout: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 0
    },
    main: {
      position: 'relative',
      height:
        'calc(100vh - 124px - 1px)' /* total height - page header - divider */
    },
    fullHeight: {
      height: '100%'
    },
    list: {
      width: `calc(${theme.spacing(36)}px + 0.5em)` /* scroll bar */
    },
    conversation: {
      overflowX: 'hidden',
      overflowY: 'auto',
      borderLeft: `1px solid ${theme.palette.grey.A100}`
    },
    conversationNoBorder: {
      borderLeft: 0
    }
  }),
  { name: 'Inbox' }
)

export default function Inbox({ params }: WithRouterProps) {
  const selectedEmailThreadId: UUID | undefined = params.emailThreadId

  const accounts = useSelector<IAppState, IOAuthAccount[]>(
    ({ contacts: { oAuthAccounts } }) =>
      selectAllConnectedAccounts(oAuthAccounts)
  )
  const noConnectedAccounts = accounts.length === 0

  const [initializing, setInitializing] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const dispatch = useDispatch()

  useEffectOnce(() => {
    dispatch(fetchOAuthAccounts()).then(() => setInitializing(false))
  })

  const inboxEmailThreadOnCloseMemoized = useCallback(
    () => setSelectedEmailThreadId(undefined),
    []
  )

  const classes = useStyles()

  return (
    <GlobalPageLayout className={classes.layout}>
      {initializing || noConnectedAccounts ? (
        <GlobalPageLayout.Header title="Inbox" />
      ) : (
        <GlobalPageLayout.HeaderWithSearch
          title="Inbox"
          placeholder="Search emails"
          onSearch={query => setSearchQuery(query)}
        />
      )}
      <GlobalPageLayout.Main className={classes.main}>
        <Divider />
        {initializing ? null : noConnectedAccounts ? (
          <InboxConnectAccount />
        ) : (
          <Grid container spacing={0} classes={{ root: classes.fullHeight }}>
            <Grid
              item
              classes={{ root: classNames(classes.list, classes.fullHeight) }}
            >
              <InboxEmailThreadList
                selectedEmailThreadId={selectedEmailThreadId}
                onSelectEmailThread={setSelectedEmailThreadId}
                searchQuery={searchQuery}
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
              <InboxEmailThread
                key={selectedEmailThreadId}
                emailThreadId={selectedEmailThreadId}
                onClose={inboxEmailThreadOnCloseMemoized}
              />
            </Grid>
          </Grid>
        )}
      </GlobalPageLayout.Main>
    </GlobalPageLayout>
  )
}
