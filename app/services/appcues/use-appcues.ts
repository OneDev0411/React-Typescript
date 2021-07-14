import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { selectUserHasAccess } from 'selectors/acl'
import { selectUserUnsafe } from 'selectors/user'
import { getOAuthAccounts } from 'models/o-auth-accounts/get-o-auth-accounts'
import { IAppState } from 'reducers'
import { OAuthProvider } from 'constants/contacts'
import { ACL } from 'constants/acl'

interface Location {
  pathname: string
}

export function useAppcues() {
  const accessList = useSelector((state: IAppState) =>
    Object.keys(ACL).reduce((acc, access) => {
      const hasAccess = selectUserHasAccess(state, ACL[access])

      return {
        ...acc,
        [`has${ACL[access]}Access`]: hasAccess
      }
    }, {})
  )

  const location = useSelector<IAppState, Location | null>(
    state => state.data.location
  )
  const user = useSelector(selectUserUnsafe)

  const userInfoToWatch = useMemo(
    () =>
      user && user.id
        ? {
            id: user.id,
            firstName: user.first_name,
            fullName: user.display_name,
            email: user.email,
            userType: user.user_type,
            createdAt: user.created_at
          }
        : null,
    [user]
  )

  const pathname = location ? location.pathname : null

  useEffect(() => {
    if (!pathname) {
      return
    }

    if (userInfoToWatch) {
      ;(async function prepareAndSendUserData() {
        const { id, createdAt, ...userInfo } = userInfoToWatch
        const google = await getOAuthAccounts(OAuthProvider.Google)
        const outlook = await getOAuthAccounts(OAuthProvider.Outlook)

        const starts = moment(createdAt * 1000)
        const ends = moment()
        const accountAge = moment.duration(ends.diff(starts))

        const userData = {
          ...userInfo,
          accountAgeInDays:
            accountAge.days() +
            accountAge.months() * 30 +
            accountAge.years() * 365,
          gmailOrOutlookSynced: Boolean(google.length || outlook.length),
          ...accessList
        }

        // Normally what we should be doing here is to call Appcues.Page(), but
        // behind the scenes, Appcues.identify() also invokes that function.
        // Reac more: https://docs.appcues.com/article/161-javascript-api
        window.AppcuesReady(() => {
          window.Appcues.identify(id, userData)
        })
      })()
    }
  }, [pathname, userInfoToWatch, accessList])
}
