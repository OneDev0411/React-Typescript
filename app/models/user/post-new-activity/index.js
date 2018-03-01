import Fetch from '../../../services/fetch'

/**
 * Log new activity.
 *
 * @param {object} activity Contains:
 * action: activity name,
 * object: as activity data,
 * object_class: as activity type
 *
 * @returns {object} Returns new activity.
 */

export default async function postNewAactivity(activity) {
  try {
    const response = await new Fetch()
      .post('/users/self/timeline')
      .send(activity)

    return response.body.data
  } catch (error) {
    throw error
  }
}
