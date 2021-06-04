import Fetch from '../../../services/fetch'

const search = async (criteria, field = 'mlsid') => {
  try {
    const response = await new Fetch()
      .get('/agents/search')
      .query({ [field]: criteria })
      .query({ 'associations[]': 'agent.office' })

    return response.body.data as IAgent[]
  } catch ({ status }) {
    throw status
  }
}

export default search
