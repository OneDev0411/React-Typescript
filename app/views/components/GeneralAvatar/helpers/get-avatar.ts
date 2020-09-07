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

  let unavatarId: string = account.display_name

  if (account.email) {
    unavatarId = account.email
  }

  return `https://unavatar.now.sh/${unavatarId}?fallback=false`
}

/**
 * return the picture of email campaign
 * @param email // IEmailCampaign
 */

export const getEmailAvatar = (email: IEmailCampaign): string => {
  if (email.template?.file?.preview_url) {
    return email.template.file.preview_url
  }

  return ''
}
