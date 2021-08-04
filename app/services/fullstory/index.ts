import { isLocalhost } from '@app/utils/location-hostname'

export function setupFullStory(user: IUser) {
  if (window && window.FS && user) {
    window.FS.identify(user.id, {
      name: user.display_name,
      email: user.email
    })

    if (isLocalhost()) {
      window.FS.shutdown()
    }
  }
}
