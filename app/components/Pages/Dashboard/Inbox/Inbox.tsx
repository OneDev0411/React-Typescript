import React, { useState, useCallback } from 'react'

import { Grid, Theme, Divider, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { WithRouterProps } from 'react-router'

import GlobalPageLayout from 'components/GlobalPageLayout'
import ImportContactsButton from 'components/ImportContactsButton'
import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { selectUnreadEmailThreadsCount } from 'reducers/inbox'

import InboxEmailThread from './components/InboxEmailThread'
import InboxEmailThreadList from './components/InboxEmailThreadList'
import InboxZeroState from './components/ZeroState'
import setSelectedEmailThreadId from './helpers/set-selected-email-thread-id'

const useStyles = makeStyles(
  (theme: Theme) => ({
    layout: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: 0,
      paddingBottom: 0
    },
    body: {
      height: 0,
      flex: '1 1 auto'
    },
    fullHeight: {
      height: '100%'
    },
    list: {
      width: `calc(${theme.spacing(47.5)}px + 0.5em)` /* scroll bar */
    },
    conversation: {
      overflowX: 'hidden',
      overflowY: 'auto',
      borderLeft: `1px solid ${theme.palette.grey.A100}`
    },
    conversationHidden: {
      display: 'none'
    }
  }),
  { name: 'Inbox' }
)

export default function Inbox({ params }: WithRouterProps) {
  const selectedEmailThreadId: UUID | undefined = params.emailThreadId

  const unreadEmailThreadsCount = useSelector((state: IAppState) =>
    selectUnreadEmailThreadsCount(state.inbox)
  )

  const accounts = useSelector(({ contacts: { oAuthAccounts } }: IAppState) =>
    selectAllConnectedAccounts(oAuthAccounts)
  )
  const noConnectedAccounts = accounts.length === 0

  const [initializing, setInitializing] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
  const [searchStatus, setSearchStatus] = useState(false)
  const [emailThreadCount, setEmailThreadCount] = useState(0)

  const handleEmailThreadsUpdate = useCallback(
    (emailThreads: IEmailThread<'contacts'>[]) =>
      setEmailThreadCount(emailThreads.length),
    []
  )

  const onFetchedOAuthAccounts = useCallback(() => {
    setInitializing(false)
  }, [])

  const handleInboxEmailThreadClose = useCallback(
    () => setSelectedEmailThreadId(undefined),
    []
  )

  const classes = useStyles()

  return (
    <GlobalPageLayout className={classes.layout}>
      <Helmet>
        <title>
          Inbox {unreadEmailThreadsCount ? `(${unreadEmailThreadsCount}) ` : ''}
          | Rechat
        </title>
      </Helmet>

      <Box paddingLeft={5} flex="0 1 auto">
        {initializing || noConnectedAccounts ? (
          <GlobalPageLayout.Header title="Inbox">
            <ImportContactsButton
              onFetchedOAuthAccounts={onFetchedOAuthAccounts}
            />
          </GlobalPageLayout.Header>
        ) : (
          <GlobalPageLayout.HeaderWithSearch
            title="Inbox"
            onSearch={query =>
              // Keep it undefined until there are actually some query.
              setSearchQuery(searchQuery => query || (searchQuery && query))
            }
            SearchInputProps={{
              placeholder: 'Search emails',
              isLoading: searchStatus
            }}
          >
            <ImportContactsButton
              onFetchedOAuthAccounts={onFetchedOAuthAccounts}
            />
          </GlobalPageLayout.HeaderWithSearch>
        )}
      </Box>

      <GlobalPageLayout.Main
        height={0}
        flex="1 1 auto"
        display="flex"
        flexDirection="column"
      >
        <Box paddingLeft={5}>
          <Divider />
        </Box>
        {initializing ? null : noConnectedAccounts ? (
          <InboxZeroState />
        ) : (
          <Grid container spacing={0} className={classes.body}>
            <Grid item className={classNames(classes.list, classes.fullHeight)}>
              <InboxEmailThreadList
                selectedEmailThreadId={selectedEmailThreadId}
                onSelectEmailThread={setSelectedEmailThreadId}
                searchQuery={searchQuery}
                onSearchStatusChange={setSearchStatus}
                onUpdateEmailThreads={handleEmailThreadsUpdate}
              />
            </Grid>
            <Grid
              item
              xs
              className={classNames(
                classes.conversation,
                emailThreadCount === 0 && classes.conversationHidden,
                classes.fullHeight
              )}
            >
              <InboxEmailThread
                key={selectedEmailThreadId}
                emailThreadId={selectedEmailThreadId}
                onClose={handleInboxEmailThreadClose}
              />
            </Grid>
          </Grid>
        )}
      </GlobalPageLayout.Main>
    </GlobalPageLayout>
  )
}
