import { OAuthProvider } from 'constants/contacts'

import * as React from 'react'
import { useContext, useEffect } from 'react'
import { connect } from 'react-redux'

import { Helmet } from 'react-helmet'

import { Box, Button, List, Typography } from '@material-ui/core'

import { AnyAction } from 'redux'

import { ThunkDispatch } from 'redux-thunk'

import { IAppState } from 'reducers'
import PageHeader from 'components/PageHeader'
import { iconSizes } from 'components/SvgIcons/icon-sizes'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'
import Loading from 'partials/Loading'
import GoogleSigninButton from 'components/GoogleSigninButton'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { syncOAuthAccount } from 'actions/contacts/sync-o-auth-account'

import { disconnectOAuthAccount } from 'actions/contacts/disconnect-o-auth-account'

import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'

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
  useEffect(() => {
    fetchOAuthAccounts()
  }, [fetchOAuthAccounts])

  const confirmation = useContext(ConfirmationModalContext)
  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  const onDelete = (provider: OAuthProvider, accountId: string) => {
    confirmation.setConfirmationModal({
      message:
        'Your account will be disconnected and removed but imported contacts and emails will be preserved.',
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
      <PageHeader style={{ marginBottom: 0, marginTop: '1.5rem' }}>
        <PageHeader.Title showBackButton={false}>
          <PageHeader.Heading>Connected Accounts</PageHeader.Heading>
        </PageHeader.Title>
        <PageHeader.Menu>
          <GoogleSigninButton
            disabled={google.connecting}
            onClick={google.connect}
          >
            Sign in with google
          </GoogleSigninButton>
          <Box mr={1} />
          <Button
            variant="outlined"
            disabled={outlook.connecting}
            onClick={outlook.connect}
          >
            <IconOutlook
              size={iconSizes.small}
              style={{ marginRight: '1rem' }}
            />
            <Typography variant="button">Sync with Outlook</Typography>
          </Button>
        </PageHeader.Menu>
      </PageHeader>

      <Box paddingX={3}>
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
      </Box>
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
