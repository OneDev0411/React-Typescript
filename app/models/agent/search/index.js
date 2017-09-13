import Fetch from '../../../services/fetch'

const search = async mlsid => {
  try {
    const response = await new Fetch().get('/agents/search').query({ mlsid })
    return response.body.data
  } catch ({ status }) {
    throw status
  }
}

export default search
