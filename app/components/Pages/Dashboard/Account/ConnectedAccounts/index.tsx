import { useContext } from 'react'

import { List, Box, Paper, Grid, Typography } from '@material-ui/core'
import { connect, useSelector } from 'react-redux'
import { useTitle } from 'react-use'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { disconnectOAuthAccount } from 'actions/contacts/disconnect-o-auth-account'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'
import { syncOAuthAccount } from 'actions/contacts/sync-o-auth-account'
import { fetchUnreadEmailThreadsCount } from 'actions/inbox'
import { disconnectDocuSign } from 'actions/user/disconnect-docusign'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import LoadingContainer from 'components/LoadingContainer'
import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { selectUser } from 'selectors/user'

import ConnectAccountButtons from './ConnectAccountButtons'
import ConnectedAccount from './ConnectedAccount'
import ConnectedAgents from './ConnectedAgents'
import ConnectedDocusign from './ConnectedDocusign'

interface Props {
  accounts: IOAuthAccount[]
  loading: boolean
  fetchOAuthAccounts: IAsyncActionProp<typeof fetchOAuthAccounts>
  syncOAuthAccount: IAsyncActionProp<typeof syncOAuthAccount>
  disconnectOAuthAccount: IAsyncActionProp<typeof disconnectOAuthAccount>
  disconnectDocuSign: IAsyncActionProp<typeof disconnectDocuSign>
  fetchUnreadEmailThreadsCount: IAsyncActionProp<
    typeof fetchUnreadEmailThreadsCount
  >
}

function ConnectedAccounts({
  accounts,
  loading,
  fetchOAuthAccounts,
  syncOAuthAccount,
  disconnectOAuthAccount,
  disconnectDocuSign,
  fetchUnreadEmailThreadsCount
}: Props) {
  useTitle('Connected Accounts | Settings | Rechat')
  useEffectOnce(() => {
    fetchOAuthAccounts()
  })

  const confirmation = useContext(ConfirmationModalContext)
  const user = useSelector(selectUser)

  if (loading) {
    return (
      <Box margin={2}>
        <LoadingContainer noPaddings />
      </Box>
    )
  }

  console.log('>>>>', user, (user.agents || []).length > 0)

  return (
    <>
      <Box marginBottom={1.5}>
        <Paper variant="outlined">
          <Box paddingX={3} paddingY={2}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography variant="subtitle2">
                  Connect other accounts
                </Typography>
              </Grid>
              <Grid item>
                <ConnectAccountButtons size="medium" />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <List disablePadding>
        {accounts.map(account => (
          <ConnectedAccount
            account={account}
            key={account.id}
            onSync={syncOAuthAccount}
            onDelete={(provider, accountId) => {
              confirmation.setConfirmationModal({
                message: `Your account will be disconnected and 
                        removed but imported contacts and emails will be preserved.`,
                onConfirm: async () => {
                  await disconnectOAuthAccount(provider, accountId)
                  await fetchUnreadEmailThreadsCount()
                }
              })
            }}
          />
        ))}
      </List>

      {user.docusign && (
        <ConnectedDocusign
          user={user}
          onDisconnect={() => {
            confirmation.setConfirmationModal({
              message:
                'Your account will be permanently disconnected from DocuSign.',
              onConfirm: async () => {
                await disconnectDocuSign()
              }
            })
          }}
        />
      )}

      {(user.agents || []).length > 0 && (
        <ConnectedAgents user={user} onDelete={() => {}} />
      )}
    </>
  )
}

const mapStateToProps = (state: IAppState) => ({
  accounts: selectAllConnectedAccounts(state.contacts.oAuthAccounts),
  loading: Object.values(state.contacts.oAuthAccounts.loading).some(i => i)
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    fetchOAuthAccounts: (...args) => dispatch(fetchOAuthAccounts(...args)),
    syncOAuthAccount: (...args: Parameters<typeof syncOAuthAccount>) =>
      dispatch(syncOAuthAccount(...args)),
    disconnectOAuthAccount: (
      ...args: Parameters<typeof disconnectOAuthAccount>
    ) => dispatch(disconnectOAuthAccount(...args)),
    disconnectDocuSign: (...args: Parameters<typeof disconnectDocuSign>) =>
      dispatch(disconnectDocuSign(...args)),
    fetchUnreadEmailThreadsCount: (
      ...args: Parameters<typeof fetchUnreadEmailThreadsCount>
    ) => dispatch(fetchUnreadEmailThreadsCount(...args))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedAccounts)
