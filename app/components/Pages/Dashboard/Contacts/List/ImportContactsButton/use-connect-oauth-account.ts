import { OAuthProvider } from 'constants/contacts'

import { useState } from 'react'

import { connectOAuthAccount } from 'models/o-auth-accounts/connect-o-auth-account'

import { startImportingOAuthContacts } from './helpers'

export function useConnectOAuthAccount(
  provider: OAuthProvider,
  scopes?: IGoogleScope[]
) {
  const [connecting, setConnecting] = useState(false)

  const connect = async () => {
    const redirectionInfo = await connectOAuthAccount(
      provider,
      undefined,
      scopes
    )
    const url = redirectionInfo.url

    setConnecting(true)

    startImportingOAuthContacts(provider)

    window.location.href = url
  }

  return { connect, connecting }
}
