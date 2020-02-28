import Fetch from '../../../services/fetch'

const getUser = async (id, token) => {
  if (!id) {
    return
  }

  try {
    const request = new Fetch().get(`/users/${id}`)

    if (token) {
      request.set('Authorization', `Bearer ${token}`)
    }

    const response = await request

    return response.body.data
  } catch ({ status }) {
    throw status
  }
}

export default getUser
