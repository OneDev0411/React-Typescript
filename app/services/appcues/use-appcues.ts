import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import moment from 'moment'

import { selectUserUnsafe } from 'selectors/user'

import { getOAuthAccounts } from 'models/o-auth-accounts/get-o-auth-accounts'

import { IAppState } from 'reducers'
import { OAuthProvider } from 'constants/contacts'

import { useAcl } from 'components/Acl/use-acl'
import { ACL } from 'constants/acl'

interface Location {
  pathname: string
}

export function useAppcues() {
  const userAccess: boolean[] = []

  userAccess[0] = useAcl(ACL.CRM)
  userAccess[1] = useAcl(ACL.ADMIN)
  userAccess[2] = useAcl(ACL.DEALS)
  userAccess[3] = useAcl(ACL.BACK_OFFICE)
  userAccess[4] = useAcl(ACL.MARKETING)
  userAccess[5] = useAcl(ACL.STORE)
  userAccess[6] = useAcl(ACL.BETA)
  userAccess[7] = useAcl(ACL.AGENT_NETWORK)

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
        const starts = moment(user.created_at * 1000)
        const ends = moment()
        const accountAge = moment.duration(ends.diff(starts))

        const userData = {
          firstName: user.first_name,
          fullName: user.display_name,
          email: user.email,
          userType: user.user_type,
          accountAgeInDays:
            accountAge.days() +
            accountAge.months() * 30 +
            accountAge.years() * 365,
          gmailOrOutlookSynced: Boolean(google.length || outlook.length),
          aclCRMAccess: userAccess[0],
          aclAdminAccess: userAccess[1],
          aclDealsAccess: userAccess[2],
          aclBackOfficeAccess: userAccess[3],
          aclMarketingAccess: userAccess[4],
          aclStoreAccess: userAccess[5],
          aclBetaAccess: userAccess[6],
          aclAgentNetworkAccess: userAccess[7]
        }

        console.log(user)
        // Normally what we should be doing here is to call Appcues.Page(), but
        // behind the scenes, Appcues.identify() also invokes that function.
        // Reac more: https://docs.appcues.com/article/161-javascript-api
        window.Appcues.identify(user.id, userData)
      }
    })()
  }, [pathname, user, userAccess])
}
