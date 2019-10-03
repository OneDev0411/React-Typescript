import { OAuthProvider } from 'constants/contacts'

import * as React from 'react'
import { ReactElement } from 'react'
import { connect } from 'react-redux'

import { IAppState } from 'reducers'

import { hasUserAccess } from 'utils/user-teams'

import { useConnectOAuthAccount } from './use-connect-oauth-account'

interface RenderProps {
  connecting: boolean
  connect: (event: React.MouseEvent) => void
}
interface Props {
  // TODO: this prop used to be used but it's not used anymore.
  // by removing this we don't need to connect to redux store and
  // therefore this component can be removed altogether.
  // I'm not doing this refactoring because we are near release!
  oAuthAccounts: StringMap<IGoogleAccount[]>
  children: (renderProps: RenderProps) => ReactElement<any>
  user: IUser
}

/**
 * A render prop component for adding google accounts.
 * If we were using latest versions of redux so that we could use redux hooks
 * this could be a simple hook with {connect, connecting} return value,
 * instead of a render prop component
 * @param props
 * @constructor
 */
function ConnectGoogleButton(props: Props) {
  const { connect, connecting } = useConnectOAuthAccount(
    OAuthProvider.Google,
    hasUserAccess(props.user, 'BetaFeatures')
      ? ['contacts.readonly', 'gmail.readonly', 'gmail.send']
      : undefined
  )

  return props.children({ connecting, connect })
}

export default connect(({ contacts: { oAuthAccounts }, user }: IAppState) => ({
  user,
  oAuthAccounts: oAuthAccounts.list
}))(ConnectGoogleButton)
