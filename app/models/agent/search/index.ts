import Fetch from '../../../services/fetch'

async function search(criteria, field = 'mlsid'): Promise<IAgent[]> {
  try {
    const response = await new Fetch()
      .get('/agents/search')
      .query({ [field]: criteria })
      .query({ 'associations[]': 'agent.office' })

    return response.body.data
  } catch ({ status }) {
    throw status
  }
}

export default search
