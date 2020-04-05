import React, { useContext } from 'react'
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import { List, Box, Paper, Grid, Typography } from '@material-ui/core'
import { Helmet } from 'react-helmet'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { syncOAuthAccount } from 'actions/contacts/sync-o-auth-account'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'
import { disconnectOAuthAccount } from 'actions/contacts/disconnect-o-auth-account'
import { fetchUnreadEmailThreadsCount } from 'actions/inbox'

import LoadingContainer from 'components/LoadingContainer'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import ConnectAccount from './ConnectAccount'
import ConnectedAccount from './ConnectedAccount'
import ConnectAccountButtons from './ConnectAccountButtons'

interface Props {
  accounts: IOAuthAccount[]
  loading: boolean
  fetchOAuthAccounts: IAsyncActionProp<typeof fetchOAuthAccounts>
  syncOAuthAccount: IAsyncActionProp<typeof syncOAuthAccount>
  disconnectOAuthAccount: IAsyncActionProp<typeof disconnectOAuthAccount>
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
  fetchUnreadEmailThreadsCount
}: Props) {
  useEffectOnce(() => {
    fetchOAuthAccounts()
  })

  const confirmation = useContext(ConfirmationModalContext)

  return (
    <>
      <Helmet>
        <title>Connected Accounts | Settings | Rechat</title>
      </Helmet>

      {loading ? (
        <Box margin={2}>
          <LoadingContainer style={{}} />
        </Box>
      ) : accounts.length === 0 ? (
        <ConnectAccount />
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
                    <ConnectAccountButtons size="small" />
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
    fetchUnreadEmailThreadsCount: (
      ...args: Parameters<typeof fetchUnreadEmailThreadsCount>
    ) => dispatch(fetchUnreadEmailThreadsCount(...args))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedAccounts)
