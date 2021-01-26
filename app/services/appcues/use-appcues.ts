import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { selectUserUnsafe } from 'selectors/user'

import { getOAuthAccounts } from 'models/o-auth-accounts/get-o-auth-accounts'

import { IAppState } from 'reducers'
import { OAuthProvider } from 'constants/contacts'

interface Location {
  pathname: string
}

export function useAppcues() {
  const location = useSelector<IAppState, Location | null>(
    state => state.data.location
  )
  const user = useSelector(selectUserUnsafe)

  const pathname = location ? location.pathname : null

  useEffect(() => {
    if (!pathname) {
      return
    }

    ;(async function prepareAndSendUserData() {
      const google = await getOAuthAccounts(OAuthProvider.Google)
      const outlook = await getOAuthAccounts(OAuthProvider.Outlook)

      if (user && user.id) {
        const userData = {
          firstName: user.first_name,
          lastName: user.last_name,
          userType: user.user_type,
          gmailOrOutlookSynced: Boolean(google.length || outlook.length)
        }

        console.log(userData)
        // Behind the scenes, this call also invokes Appcues.page()
        // More: https://docs.appcues.com/article/161-javascript-api
        window.Appcues.identify(user.id, userData)
      }
    })()
  }, [pathname, user])
}
