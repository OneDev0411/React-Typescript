/**
 * return the avatar url of user or contact
 * @param account // User, Contact, Auth Account
 */

export const getAccountAvatar = (
  account: IUser | IContact | INormalizedContact | IOAuthAccount
): string => {
  if (account.profile_image_url) {
    return account.profile_image_url
  }

  let unavatarUrl: string = account.email
    ? `https://unavatar.now.sh/${account.email}?fallback=false`
    : ''

  return unavatarUrl
}

/**
 * return the picture of email campaign
 * @param email // IEmailCampaign
 */

export const getEmailAvatar = (email: IEmailCampaign): string => {
  return email.template?.file?.preview_url ?? ''
}
