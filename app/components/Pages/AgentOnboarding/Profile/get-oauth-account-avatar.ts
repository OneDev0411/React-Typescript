import {
  GOOGLE_CREDENTIAL,
  MICROSOFT_CREDENTIAL
} from 'constants/oauth-accounts'

import { Avatar } from './types'

export function getOauthAccountAvatar(
  connectedAccounts: IOAuthAccount[]
): Avatar {
  let avatar: Avatar = { src: '' }

  if (connectedAccounts.length === 0) {
    return avatar
  }

  const googleAccount = connectedAccounts.find(
    a => a.type === GOOGLE_CREDENTIAL
  )

  if (googleAccount && googleAccount.profile_image_url) {
    return prepareReturnObject(googleAccount, 'Google')
  }

  let otherAccount: IOAuthAccount = connectedAccounts[0]

  if (
    otherAccount.type === MICROSOFT_CREDENTIAL &&
    otherAccount.profile_image_url
  ) {
    return prepareReturnObject(otherAccount, 'Outlook')
  }

  return avatar
}

function prepareReturnObject(
  account: IOAuthAccount,
  type: 'Google' | 'Outlook'
): Avatar {
  return {
    src: account.profile_image_url || '',
    type
  }
}
