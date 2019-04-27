import Fetch from '../../../services/fetch'

/**
 * Adding new attributes to the contacts which match the provided filters.
 */

export async function addAttributesBulk({
  attributes = [],
  users = [],
  searchText = '',
  conditionOperator = 'and',
  filters = [],
  excludes = []
}) {
  try {
    const request = new Fetch().post('/contacts/attributes')

    request.query({
      filter_type: conditionOperator
    })

    const payload = {
      filters: filters.map(({ attribute_def, invert, operator, value }) => ({
        attribute_def,
        invert,
        operator,
        value
      })),
      attributes,
      excludes
    }
    const cleanedSearchText = searchText
      .trim()
      .replace(/[~`!#$%^&*(){}=<>?,:;'"\]\[\/\\]/g, '')

    if (cleanedSearchText.length > 0) {
      payload.query = cleanedSearchText
    }

    if (users.length > 0) {
      request.query(`users[]=${users.join('&users[]=')}`)
    }

    return request.send(payload)
  } catch (error) {
    throw error
  }
}
