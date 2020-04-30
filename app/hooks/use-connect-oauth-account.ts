import { OAuthProvider } from 'constants/contacts'

import { useState } from 'react'

import { connectOAuthAccount } from 'models/o-auth-accounts/connect-o-auth-account'

import { useOnRestoredFromPersistedState } from 'hooks/use-on-restored-from-persisted-state'

import { startImportingOAuthContacts } from 'utils/oauth-provider'

export function useConnectOAuthAccount(
  provider: OAuthProvider,
  scopes?: IGoogleScope[]
) {
  const [connecting, setConnecting] = useState(false)

  // This is for safari. See this: https://gitlab.com/rechat/web/issues/3578
  useOnRestoredFromPersistedState(() => {
    window.location.reload()
    // NOTE: we reload the whole page instead of `setConnecting(false)`,
    // because the latter only works for first time for some reason
  }, [])

  const connect = async () => {
    if (connecting) {
      return
    }

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
