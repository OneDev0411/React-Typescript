import Fetch from '../../../services/fetch'

async function fetchContacts(user, start = 0, limit = 10000) {
  const { access_token } = user

  try {
    const fetchContacts = new Fetch()
      .get('/contacts')
      .query({ start })
      .query({ limit })
      .query({ sorting_value: 'Update' })
      .query({ 'associations[]': ['user.last_seen_by'] })

    // required on ssr
    if (access_token) {
      fetchContacts.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await fetchContacts

    return response.body
  } catch (error) {
    throw error
  }
}

export default fetchContacts
