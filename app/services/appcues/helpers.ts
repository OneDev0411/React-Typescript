import { differenceInDays } from 'date-fns'

import { ACL } from '@app/constants/acl'

import {
  AppcuesUserInfo,
  AppcuesUserAccessList,
  AppcuesBrandsList
} from './types'

export const DEFAULT_APPCUES_USER_ACL = Object.values(
  ACL
).reduce<AppcuesUserAccessList>((acc, cur) => {
  return {
    ...acc,
    [`has${ACL[cur]}Access`]: false
  }
}, {} as AppcuesUserAccessList)

export function createAppcuesAccessList(
  userACL: IPermission[],
  appcuesUserAccessList: AppcuesUserAccessList
): AppcuesUserAccessList {
  const appcuesAccessList: AppcuesUserAccessList = {
    ...appcuesUserAccessList
  }

  userACL.forEach(acl => {
    appcuesAccessList[`has${acl}Access`] = true
  })

  return appcuesAccessList
}

function createAppcuesBrandsList(activeBrand: IBrand | null) {
  const list: Record<string, UUID> = {}

  if (!activeBrand) {
    return list
  }

  let current: IBrand | null = activeBrand

  do {
    list[current.brand_type] = current.id
    current = current.parent
  } while (current !== null)

  return list
}

export function createAppcuesUserData(
  gmailOrOutlookSynced: boolean,
  userInfo: AppcuesUserInfo,
  appcuesAccessList: AppcuesUserAccessList,
  appcuesBrandsList: AppcuesBrandsList
) {
  const { createdAt, ...restInfo } = userInfo

  return {
    ...restInfo,
    accountAgeInDays: differenceInDays(new Date(), createdAt * 1000),
    gmailOrOutlookSynced,
    ...appcuesAccessList,
    ...appcuesBrandsList
  }
}

export async function prepareAndSendUserData(
  activeBrand: IBrand | null,
  accessList: IPermission[],
  userId: string,
  userInfo: AppcuesUserInfo,
  gmailOrOutlookSynced: boolean
) {
  const appcuesAccessList = createAppcuesAccessList(
    accessList,
    DEFAULT_APPCUES_USER_ACL
  )

  const appcuesBrandsList = createAppcuesBrandsList(activeBrand)

  const userData = createAppcuesUserData(
    gmailOrOutlookSynced,
    userInfo,
    appcuesAccessList,
    appcuesBrandsList
  )

  // Normally what we should be doing here is to call Appcues.Page(), but
  // behind the scenes, Appcues.identify() also invokes that function.
  // Reac more: https://docs.appcues.com/article/161-javascript-api
  if (window.AppcuesReady && window.Appcues) {
    window.AppcuesReady(() => {
      window.Appcues.identify(userId, userData)
    })
  }
}
