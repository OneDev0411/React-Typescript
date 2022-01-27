import { getUserWithOnBehalfVariable } from '@app/utils/marketing-center/get-user-with-on-behalf-variable'

const defaultAvatar = '/static/images/marketing/editor/default-avatar.svg'

export function getCorrectedUser(user: IUser, viewAsAdmin: boolean): IUser {
  const userWithFallbackAvatar = {
    ...user,
    profile_image_url: user.profile_image_url || defaultAvatar
  }

  if (!viewAsAdmin) {
    return userWithFallbackAvatar
  }

  return {
    ...getUserWithOnBehalfVariable(userWithFallbackAvatar),
    profile_image_url: defaultAvatar
  }
}
