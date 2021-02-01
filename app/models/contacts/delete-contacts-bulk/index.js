import removeSpecialCharacters from 'utils/remove-special-characters'

import Fetch from '../../../services/fetch'

export async function deleteContactsBulk({
  users = [],
  searchText = '',
  conditionOperator = 'and',
  filters = [],
  excludes = [],
  parked = true
}) {
  try {
    const request = new Fetch().delete('/contacts/')

    request.query({
      filter_type: conditionOperator
    })

    const cleanedSearchText = removeSpecialCharacters(searchText)

    const payload = {
      filters: filters.map(({ attribute_def, invert, operator, value }) => ({
        attribute_def,
        invert,
        operator,
        value
      })),
      excludes,
      // we're doing this because when we have search
      // value we show all type of contact
      parked: cleanedSearchText.length > 0 ? undefined : parked
    }

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
