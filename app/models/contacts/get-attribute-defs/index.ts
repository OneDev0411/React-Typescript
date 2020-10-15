import Fetch from '../../../services/fetch'

export async function getAttributeDefs(): Promise<IContactAttributeDef[]> {
  try {
    const response = await new Fetch().get('/contacts/attribute_defs')

    return response.body.data
  } catch (error) {
    throw error
  }
}
