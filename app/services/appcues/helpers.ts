import moment from 'moment'

import { AccessRecord } from '@app/constants/acl'
import { getOAuthAccounts } from 'models/o-auth-accounts/get-o-auth-accounts'
import { OAuthProvider } from 'constants/contacts'
import { ACL } from 'constants/acl'

import { AppcuesUserInfo } from './types'

export function createAppcuesAccessList(
  userACL: IPermission[],
  allACL: AccessRecord
) {
  const AllACLs = Object.keys(allACL).reduce((acc, cur) => {
    return {
      ...acc,
      [`has${allACL[cur]}Access`]: false
    }
  }, {})

  const mappedAccessList: Record<string, string> = userACL.reduce(
    (acc, cur) => ({
      ...acc,
      [`has${cur}Access`]: true
    }),
    AllACLs
  )

  return mappedAccessList
}

export async function prepareAndSendUserData(
  accessList: IPermission[],
  userInfoToWatch: AppcuesUserInfo
) {
  const { id, createdAt, ...userInfo } = userInfoToWatch
  const google = await getOAuthAccounts(OAuthProvider.Google)
  const outlook = await getOAuthAccounts(OAuthProvider.Outlook)

  const starts = moment(createdAt * 1000)
  const ends = moment()
  const accountAge = moment.duration(ends.diff(starts))

  const mappedAccessList = createAppcuesAccessList(accessList, ACL)

  const userData = {
    ...userInfo,
    accountAgeInDays:
      accountAge.days() + accountAge.months() * 30 + accountAge.years() * 365,
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
