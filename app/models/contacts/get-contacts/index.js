import { normalize } from 'normalizr'
import { contactsSchema } from '../schema'
import Fetch from '../../../services/fetch'

async function fetchContacts(user) {
  const { access_token } = user

  try {
    const fetchContacts = new Fetch()
      .get('/contacts')
      .query({ limit: 10000 })
      .query({ sorting_value: 'Update' })
      .query({ 'associations[]': ['user.last_seen_by'] })

    // required on ssr
    if (access_token) {
      fetchContacts.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await fetchContacts
    const { data, info } = response.body
    const contacts = { contacts: data }
    const normalizedData = normalize(contacts, contactsSchema)

    return {
      info,
      ...normalizedData
    }
  } catch (error) {
    throw error
  }
}

export default fetchContacts
