import Cookies from 'universal-cookie'

import Fetch from '../../../services/fetch'

const cookies = new Cookies()

/**
 * Log new activity.
 */

export async function logUserActivity(
  activity: IUserActivity,
  isIpNeeded: boolean = false
): Promise<unknown> {
  try {
    let data = { ...activity }

    // Get user ip address from cookie which is set by the proxy server
    if (isIpNeeded) {
      const userCookie = cookies.get('user') as unknown as { ip: string }

      const userIpAddress = userCookie ? userCookie.ip : ''

      data = {
        ...activity,
        // add user ip address to object_sa if needed
        object: {
          ...(activity.object as object),
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
