import { OAuthProvider } from 'constants/contacts'

import { useState } from 'react'

import { connectOAuthAccount } from 'models/contacts/connect-o-auth-account'

import { startImportingOAuthContacts } from './helpers'

export function useConnectOAuthAccount(
  provider: OAuthProvider,
  accountsMap: StringMap<IOAuthAccount[]>
) {
  const [connecting, setConnecting] = useState(false)

  const connect = async () => {
    const redirectionInfo = await connectOAuthAccount(provider)
    const url = redirectionInfo.url

    setConnecting(true)

    startImportingOAuthContacts(provider)

    window.location.href = url
  }

  return { connect, connecting }
}
