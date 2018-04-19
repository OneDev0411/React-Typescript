import Fetch from '../../../services/fetch'

export default async function postBulkContacts(contacts) {
  try {
    const response = await new Fetch().post('/contacts').send({
      contacts,
      options: {
        get: true, // not works
        relax: true
      }
    })

    return response.body
  } catch (error) {
    throw error
  }
}
