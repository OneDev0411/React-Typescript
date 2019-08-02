import Fetch from '../../../services/fetch'

/**
 * Update user info like first_name and last_name
 */
const editUser = async (params: IUserInput) => {
  try {
    const response = await new Fetch().put('/users/self').send(params)

    return response.body.data
  } catch (error) {
    throw error
  }
}

export default editUser
