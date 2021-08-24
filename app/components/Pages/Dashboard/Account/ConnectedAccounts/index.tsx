import React, { useContext } from 'react'

import { List, Box, Paper, Grid, Typography } from '@material-ui/core'
import { Helmet } from 'react-helmet'
import { connect, useSelector } from 'react-redux'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { disconnectDocuSign } from 'actions/contacts/disconnect-docusign'
import { disconnectOAuthAccount } from 'actions/contacts/disconnect-o-auth-account'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'
import { syncOAuthAccount } from 'actions/contacts/sync-o-auth-account'
import { fetchUnreadEmailThreadsCount } from 'actions/inbox'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import LoadingContainer from 'components/LoadingContainer'
import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { selectUser } from 'selectors/user'

import ConnectAccountButtons from './ConnectAccountButtons'
import ConnectedAccount from './ConnectedAccount'
import ConnectedDocusign from './ConnectedDocusign'
import ZeroState from './ZeroState'

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
  useEffectOnce(() => {
    fetchOAuthAccounts()
  })

  const confirmation = useContext(ConfirmationModalContext)
  const user = useSelector(selectUser)

  return (
    <>
      <Helmet>
        <title>Connected Accounts | Settings | Rechat</title>
      </Helmet>

      {loading ? (
        <Box margin={2}>
          <LoadingContainer noPaddings />
        </Box>
      ) : accounts.length === 0 ? (
        <ZeroState />
      ) : (
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
          </List>
        </>
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
