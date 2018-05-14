import Fetch from '../../../services/fetch'

/**
 * Update user timezone
 * @return {Number} 204 code as success response
 */
export async function setUserTimezone(time_zone) {
  if (!time_zone) {
    throw new Error(`time_zone is ${time_zone}.`)
  }

  try {
    return await new Fetch().patch('/users/self/timezone').send({ time_zone })
  } catch (error) {
    throw error
  }
}
