import Fetch from '../../../services/fetch'

/**
 * Update user info like first_name and last_name
 * @param {object}
 */
const editUser = async params => {
  try {
    const response = await new Fetch().put('/users/self').send(params)
    return response.body.data
  } catch ({ status }) {
    throw status
  }
}

export default editUser
