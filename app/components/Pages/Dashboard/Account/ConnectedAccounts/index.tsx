import React, { useContext } from 'react'
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import { List } from '@material-ui/core'
import { Helmet } from 'react-helmet'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { syncOAuthAccount } from 'actions/contacts/sync-o-auth-account'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'
import { disconnectOAuthAccount } from 'actions/contacts/disconnect-o-auth-account'

import Loading from 'partials/Loading'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import ConnectAccounts from './ConnectAccounts'
import { ConnectedAccount } from './ConnectedAccount'

interface Props {
  accounts: IOAuthAccount[]
  loading: boolean
  fetchOAuthAccounts: IAsyncActionProp<typeof fetchOAuthAccounts>
  syncOAuthAccount: IAsyncActionProp<typeof syncOAuthAccount>
  disconnectOAuthAccount: IAsyncActionProp<typeof disconnectOAuthAccount>
}

function ConnectedAccounts({
  accounts,
  loading,
  fetchOAuthAccounts,
  syncOAuthAccount,
  disconnectOAuthAccount
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
        <Loading />
      ) : accounts.length === 0 ? (
        <ConnectAccounts />
      ) : (
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
                  onConfirm: () => {
                    disconnectOAuthAccount(provider, accountId)
                  }
                })
              }}
            />
          ))}
        </List>
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
    ) => dispatch(disconnectOAuthAccount(...args))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedAccounts)
