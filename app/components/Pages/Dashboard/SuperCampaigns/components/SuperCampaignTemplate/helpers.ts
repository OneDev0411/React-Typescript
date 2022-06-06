import { getUserWithOnBehalfVariable } from '@app/utils/marketing-center/get-user-with-on-behalf-variable'
import { defaultUserAvatar } from '@app/views/components/InstantMarketing/Builder/extensions/add-fallback-src-to-mj-image'

export function getCorrectedUser(user: IUser, viewAsAdmin: boolean): IUser {
  const userWithFallbackAvatar = {
    ...user,
    profile_image_url: user.profile_image_url || defaultUserAvatar
  }

  if (!viewAsAdmin) {
    return userWithFallbackAvatar
  }

  return {
    ...getUserWithOnBehalfVariable(userWithFallbackAvatar),
    profile_image_url: defaultUserAvatar
  }
}
