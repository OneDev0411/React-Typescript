import Fetch from '@app/services/fetch'

import { updateContactQuery } from '../helpers/default-query'

const DEFAULT_QUERY = {
  ...updateContactQuery,
  relax: true,
  activity: false
}

export async function importContacts(contacts, query = DEFAULT_QUERY) {
  try {
    const response = await new Fetch()
      .post('/contacts/import.json')
      .send({ contacts })
      .query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
