import Fetch from '../../../services/fetch'

const getUser = async id => {
  if (!id) {
    return
  }

  try {
    const response = await new Fetch().get(`/users/${id}`)
    return response.body.data
  } catch ({ status }) {
    throw status
  }
}

export default getUser
