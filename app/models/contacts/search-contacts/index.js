import Fetch from '../../../services/fetch'

export async function searchContacts(q) {
  if (!q) {
    throw new Error('Keyword is required for query!')
  }

  try {
    const response = await new Fetch()
      .get('/contacts/filter')
      .query({ 'q[]': q })

    return response.body
  } catch (error) {
    throw error
  }
}
