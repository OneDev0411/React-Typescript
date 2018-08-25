import Fetch from '../../../services/fetch'

/**
 * Create an attribute definiation for contacts.
 * @param {Object} attributeDefinition - new attribute definition.
 * @returns {Object} Returns new attribute definition.
 */

export async function createAttributeDefinition(attributeDefinition) {
  try {
    const response = await new Fetch()
      .post('/contacts/attribute_defs')
      .send(attributeDefinition)

    return response.body.data
  } catch (error) {
    throw error
  }
}
