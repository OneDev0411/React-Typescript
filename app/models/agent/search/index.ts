import Fetch from '../../../services/fetch'

interface AgentSearchOptions {
  q?: string
  mlsid?: string
  mls?: string[]
}
async function search({
  mls,
  ...otherOptions
}: AgentSearchOptions): Promise<IAgent[]> {
  const query: Exclude<AgentSearchOptions, 'mls'> & { 'mls[]'?: string[] } = {
    ...otherOptions
  }

  if (mls && mls.length) {
    query['mls[]'] = mls
  }

  try {
    const response = await new Fetch()
      .get('/agents/search')
      .query(query)
      .query({ 'associations[]': 'agent.office' })

    return response.body.data
  } catch ({ status }) {
    throw status
  }
}

export default search
