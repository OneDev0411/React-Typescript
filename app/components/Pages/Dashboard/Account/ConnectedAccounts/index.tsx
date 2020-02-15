import { OAuthProvider } from 'constants/contacts'

import React, { useContext } from 'react'
import { AnyAction } from 'redux'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import { Box, Button, List } from '@material-ui/core'
import { Helmet } from 'react-helmet'

import { useConnectOAuthAccount } from 'crm/List/ImportContactsButton/use-connect-oauth-account'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { syncOAuthAccount } from 'actions/contacts/sync-o-auth-account'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'
import { disconnectOAuthAccount } from 'actions/contacts/disconnect-o-auth-account'

import Loading from 'partials/Loading'
import IconGoogle from 'components/SvgIcons/Google/IconGoogle'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { ConnectedAccount } from './ConnectedAccount'

interface Props {
  accounts: IOAuthAccount[]
  loading: boolean
  fetchOAuthAccounts: IAsyncActionProp<typeof fetchOAuthAccounts>
  syncOAuthAccount: IAsyncActionProp<typeof syncOAuthAccount>
  disconnectOAuthAccount: IAsyncActionProp<typeof disconnectOAuthAccount>
}

const iconSize = { width: 16, height: 16 }

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
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)
  const google = useConnectOAuthAccount(OAuthProvider.Google)

  const onDelete = (provider: OAuthProvider, accountId: string) => {
    confirmation.setConfirmationModal({
      message: `Your account will be disconnected and 
        removed but imported contacts and emails will be preserved.`,
      onConfirm: () => {
        disconnectOAuthAccount(provider, accountId)
      }
    })
  }

  return (
    <>
      <Helmet>
        <title>Connected Accounts | Settings | Rechat</title>
      </Helmet>

      <Box p={2} my={2}>
        <Button
          variant="outlined"
          disabled={outlook.connecting}
          onClick={outlook.connect}
        >
          <IconOutlook size={iconSize} />
          <Box pl={1}>Connect Outlook</Box>
        </Button>
        <Box display="inline-block" mr={1} />
        <Button
          variant="outlined"
          disabled={google.connecting}
          onClick={google.connect}
        >
          <IconGoogle size={iconSize} />
          <Box pl={1}>Connect Google</Box>
        </Button>
      </Box>

      {loading && accounts.length === 0 ? (
        <Loading />
      ) : (
        <List disablePadding>
          {accounts.map(account => (
            <ConnectedAccount
              account={account}
              key={account.id}
              onSync={syncOAuthAccount}
              onDelete={onDelete}
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
