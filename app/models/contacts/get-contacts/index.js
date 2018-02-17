import { normalize, schema } from 'normalizr'
import Fetch from '../../../services/fetch'

async function getAllContacts(user) {
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
    const contact = new schema.Entity('contacts')
    const contactsSchema = { contacts: [contact] }
    const normalizedData = normalize(contacts, contactsSchema)

    return {
      info,
      ...normalizedData
    }
  } catch (error) {
    throw error
  }
}

export default getAllContacts
