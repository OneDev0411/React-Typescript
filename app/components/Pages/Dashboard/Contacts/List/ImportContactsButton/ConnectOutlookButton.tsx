import { OAuthProvider } from 'constants/contacts'

import * as React from 'react'
import { ReactElement } from 'react'
import { connect } from 'react-redux'

import { IAppState } from 'reducers'

import { useConnectOAuthAccount } from './use-connect-oauth-account'

interface RenderProps {
  connecting: boolean
  connect: (event: React.MouseEvent) => void
}
interface Props {
  oAuthAccounts: EnumMap<OAuthProvider, IMicrosoftAccount[]>
  children: (renderProps: RenderProps) => ReactElement<any>
}

/**
 * A render prop component for adding microsoft accounts.
 * If we were using latest versions of redux so that we could use redux hooks
 * this could be a simple hook with {connect, connecting} return value,
 * instead of a render prop component
 * @param props
 * @constructor
 */
function ConnectOutlookButton(props: Props) {
  const { connect, connecting } = useConnectOAuthAccount(
    OAuthProvider.Outlook,
    props.oAuthAccounts
  )

  return props.children({ connecting, connect })
}

export default connect(({ contacts: { oAuthAccounts } }: IAppState) => ({
  oAuthAccounts: oAuthAccounts.list
}))(ConnectOutlookButton)
