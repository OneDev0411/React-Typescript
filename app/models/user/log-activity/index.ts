import Cookies from 'js-cookie'

import Fetch from '../../../services/fetch'

/**
 * Log new activity.
 */

export async function logUserActivity(
  activity: TUserActivity,
  isIpNeeded: boolean = false
): Promise<unknown> {
  try {
    let data = { ...activity }

    // Get user ip address from cookie which is set by the proxy server
    if ('object_sa' in activity && !!activity.object_sa && isIpNeeded) {
      const userCookie = Cookies.get('user')
      const userIpAddress = userCookie
        ? (JSON.parse(userCookie)?.ip as string)
        : ''

      data = {
        ...activity,
        // add user ip address to object_sa if needed
        object_sa: {
          ...activity.object_sa,
          ip_address: userIpAddress
        }
      }
    }

    const response = await new Fetch().post('/users/self/timeline').send(data)

    return response.body.data
  } catch (error) {
    throw error
  }
}
