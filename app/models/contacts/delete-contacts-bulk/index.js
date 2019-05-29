import removeSpecialCharacters from 'utils/remove-special-characters'

import Fetch from '../../../services/fetch'

export async function deleteContactsBulk({
  users = [],
  searchText = '',
  conditionOperator = 'and',
  filters = [],
  excludes = []
}) {
  try {
    const request = new Fetch().delete('/contacts/')

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
      excludes
    }
    const cleanedSearchText = removeSpecialCharacters(searchText)

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
