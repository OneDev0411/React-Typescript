import { differenceInDays } from 'date-fns'

import { ACL } from '@app/constants/acl'
import { getOAuthAccounts } from 'models/o-auth-accounts/get-o-auth-accounts'
import { OAuthProvider } from 'constants/contacts'

import { AppcuesUserInfo } from './types'

export const DEFAULT_APPCUES_USER_ACL = Object.values(ACL).reduce(
  (acc, cur) => {
    return {
      ...acc,
      [`has${ACL[cur]}Access`]: false
    }
  },
  {} as Record<`has${keyof typeof ACL}Access`, boolean>
)

export function createAppcuesAccessList(
  userACL: IPermission[],
  defaultUserAcl = DEFAULT_APPCUES_USER_ACL
) {
  const appcuesAccessList: typeof DEFAULT_APPCUES_USER_ACL = {
    ...defaultUserAcl
  }

  userACL.forEach(acl => {
    appcuesAccessList[acl] = true
  })

  return appcuesAccessList
}

export async function prepareAndSendUserData(
  accessList: IPermission[],
  userInfo: AppcuesUserInfo
) {
  const { id, createdAt, ...restInfo } = userInfo
  const google = await getOAuthAccounts(OAuthProvider.Google)
  const outlook = await getOAuthAccounts(OAuthProvider.Outlook)

  const mappedAccessList = createAppcuesAccessList(accessList)

  const userData = {
    ...restInfo,
    accountAgeInDays: differenceInDays(new Date(), createdAt * 1000),
    gmailOrOutlookSynced: Boolean(google.length || outlook.length),
    ...mappedAccessList
  }

  // Normally what we should be doing here is to call Appcues.Page(), but
  // behind the scenes, Appcues.identify() also invokes that function.
  // Reac more: https://docs.appcues.com/article/161-javascript-api
  window.AppcuesReady(() => {
    window.Appcues.identify(id, userData)
  })
}
