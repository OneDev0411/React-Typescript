import Fetch from '../../../services/fetch'

export default async function postBulkContacts(contacts) {
  try {
    const response = await new Fetch()
      .post('/contacts?get=true&relax=true')
      .send({ contacts })

    return response.body
  } catch (error) {
    throw error
  }
}
