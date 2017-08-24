import Fetch from '../../../services/fetch'

/**
 * Upgrade user to agent wirh its agent_id and secret question answer
 * @param {object} // contain agent and secret key
 */
const upgrade = async params => {
  try {
    const response = await new Fetch().patch('/users/self/upgrade').send(params)
    return response.statusCode
  } catch ({ status }) {
    throw status
  }
}

export default upgrade
