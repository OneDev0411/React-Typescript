import Fetch from '../../../services/fetch'

const search = async (criteria, field = 'mlsid') => {
  try {
    const response = await new Fetch()
      .get('/agents/search')
      .query({ [field]: criteria })

    return response.body.data
  } catch ({ status }) {
    throw status
  }
}

export default search
