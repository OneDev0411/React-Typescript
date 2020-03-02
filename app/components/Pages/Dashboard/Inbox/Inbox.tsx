import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WithRouterProps } from 'react-router'
import { Grid, Theme, Box, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'

import GlobalPageLayout from 'components/GlobalPageLayout'
import LoadingContainer from 'components/LoadingContainer'

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
      height:
        'calc(100vh - 120px - 1px)' /* total height - page header - divider */
    },
    fullHeight: {
      height: '100%'
    },
    list: {
      width: theme.spacing(36) + 1 /* right border */ + 8 /* scroll bar */
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

interface Props {}

export default function Inbox({ params }: Props & WithRouterProps) {
  const selectedEmailThreadId: UUID | undefined = params.emailThreadId

  const accounts = useSelector<IAppState, IOAuthAccount[]>(
    ({ contacts: { oAuthAccounts } }) =>
      selectAllConnectedAccounts(oAuthAccounts)
  )
  const noConnectedAccounts = accounts.length === 0

  const [initializing, setInitializing] = useState<boolean>(true)

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
      <GlobalPageLayout.HeaderWithSearch
        title="Inbox"
        placeholder="Search emails"
        onSearch={query => {
          console.log('query =', query)
        }}
      />
      <GlobalPageLayout.Main className={classes.main}>
        <Divider />
        {initializing ? (
          <Box padding={10}>
            <LoadingContainer style={{}} />
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
                selectedEmailThreadId={selectedEmailThreadId}
                onSelectEmailThread={setSelectedEmailThreadId}
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
