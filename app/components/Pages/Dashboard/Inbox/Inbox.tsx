import { useState, useCallback } from 'react'

import { Grid, Theme, Divider, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { mdiEmailOutline } from '@mdi/js'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { useTitle } from 'react-use'

import { useNavigate } from '@app/hooks/use-navigate'
import { WithRouterProps } from '@app/routes/types'
import AddAccountButton from '@app/views/components/AddAccountButton'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import GlobalPageLayout from 'components/GlobalPageLayout'
import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { selectUnreadEmailThreadsCount } from 'reducers/inbox'

import InboxEmailThread from './components/InboxEmailThread'
import InboxEmailThreadList from './components/InboxEmailThreadList'
import InboxZeroState from './components/ZeroState'

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
    },
    addAccountButton: {
      marginLeft: theme.spacing(2)
    }
  }),
  { name: 'Inbox' }
)

export default function Inbox({ params }: WithRouterProps) {
  const navigate = useNavigate()
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
  const [isOpenEmailComposeDrawer, setIsOpenEmailComposeDrawer] =
    useState(false)
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
    () => navigate('/dashboard/inbox'),
    [navigate]
  )

  const setSelectedEmailThreadId = (
    selectedEmailThreadId: UUID | undefined
  ) => {
    navigate(
      selectedEmailThreadId
        ? `/dashboard/inbox/${selectedEmailThreadId}`
        : '/dashboard/inbox'
    )
  }

  const classes = useStyles()

  useTitle(
    `Inbox ${
      unreadEmailThreadsCount ? `(${unreadEmailThreadsCount}) ` : ''
    } | Rechat`
  )

  return (
    <GlobalPageLayout className={classes.layout}>
      <Box paddingLeft={5} flex="0 1 auto">
        {initializing || noConnectedAccounts ? (
          <GlobalPageLayout.Header title="Inbox">
            <AddAccountButton
              leadChannels={['Realtor', 'Zillow']}
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
            <AddAccountButton
              className={classes.addAccountButton}
              createMenuItemProps={[
                {
                  title: 'Compose an email',
                  iconPath: mdiEmailOutline,
                  onClick: () => {
                    setIsOpenEmailComposeDrawer(true)
                  }
                }
              ]}
              onFetchedOAuthAccounts={onFetchedOAuthAccounts}
              leadChannels={['Realtor', 'Zillow']}
            />
            {isOpenEmailComposeDrawer && (
              <SingleEmailComposeDrawer
                isOpen
                onClose={() => {
                  setIsOpenEmailComposeDrawer(false)
                }}
              />
            )}
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
