import Fetch from '../../../services/fetch'

const getAlert = async id => {
  try {
    const response = await new Fetch().get(`/alerts/${id}`)

    return response.body.data
  } catch (error) {
    throw error
  }
}

export default getAlert
