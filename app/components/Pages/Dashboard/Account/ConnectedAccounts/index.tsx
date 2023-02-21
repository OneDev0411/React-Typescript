import { useContext } from 'react'

import {
  List,
  Box,
  Typography,
  makeStyles,
  CircularProgress
} from '@material-ui/core'
import { connect, useSelector } from 'react-redux'
import { useTitle } from 'react-use'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { RouteComponentProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import Acl from '@app/views/components/Acl'
import { disconnectOAuthAccount } from 'actions/contacts/disconnect-o-auth-account'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'
import { syncOAuthAccount } from 'actions/contacts/sync-o-auth-account'
import { disconnectDocuSign } from 'actions/user/disconnect-docusign'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { selectUser } from 'selectors/user'

import useNotificationBadgesContext from '../../SideNav/notificationBadgesContext/useNotificationBadgesContext'

import ConnectAccountButtons from './ConnectAccountButtons'
import ConnectedAccount from './ConnectedAccount'
import ConnectedAgents from './ConnectedAgents'
import ConnectedDocusign from './ConnectedDocusign'
import ConnectedInstagram from './ConnectedInstagram'
import { ConnectedLeadChannels } from './ConnectedLeadChannels'

const useStyles = makeStyles(
  theme => ({
    section: { marginTop: theme.spacing(6) }
  }),
  { name: 'ConnectedAccountsLayout' }
)

interface Props extends RouteComponentProps {
  accounts: IOAuthAccount[]
  fetchOAuthAccounts: IAsyncActionProp<typeof fetchOAuthAccounts>
  syncOAuthAccount: IAsyncActionProp<typeof syncOAuthAccount>
  disconnectOAuthAccount: IAsyncActionProp<typeof disconnectOAuthAccount>
  disconnectDocuSign: IAsyncActionProp<typeof disconnectDocuSign>
}

function ConnectedAccounts({
  accounts,
  fetchOAuthAccounts,
  syncOAuthAccount,
  disconnectOAuthAccount,
  disconnectDocuSign
}: Props) {
  const classes = useStyles()
  const { reload: reloadNotificationBadgesContext } =
    useNotificationBadgesContext()

  useTitle('Connected Accounts | Settings | Rechat')
  useEffectOnce(() => {
    fetchOAuthAccounts()
  })

  const confirmation = useContext(ConfirmationModalContext)
  const user = useSelector(selectUser)
  const isOAuthLoading = useSelector<IAppState, boolean>(state =>
    Object.values(state.contacts.oAuthAccounts.loading).some(i => i)
  )

  return (
    <>
      <Box>
        <Box mb={4}>
          <Typography variant="subtitle1">Accounts</Typography>

          <Typography variant="body2" color="textSecondary">
            Connect your Google or Outlook account and see your emails, contacts
            and calendar events right from inside Rechat.
          </Typography>
        </Box>

        <ConnectAccountButtons size="medium" />
      </Box>

      <List disablePadding>
        {isOAuthLoading ? (
          <Box my={2}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          accounts.map(account => (
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
                    reloadNotificationBadgesContext()
                  }
                })
              }}
            />
          ))
        )}
      </List>

      <ConnectedAgents className={classes.section} user={user} />
      <ConnectedInstagram className={classes.section} />

      <Acl.LeadAssignment>
        <ConnectedLeadChannels className={classes.section} />
      </Acl.LeadAssignment>

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
    </>
  )
}

const mapStateToProps = (state: IAppState) => ({
  accounts: selectAllConnectedAccounts(state.contacts.oAuthAccounts)
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
      dispatch(disconnectDocuSign(...args))
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ConnectedAccounts)
)
