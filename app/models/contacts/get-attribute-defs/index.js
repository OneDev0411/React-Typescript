import Fetch from '../../../services/fetch'

export async function getAttributeDefs() {
  try {
    const response = await new Fetch().get('/contacts/attribute_defs')

    return response.body.data
  } catch (error) {
    throw error
  }
}
