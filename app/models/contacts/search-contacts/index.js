import { cleanSearchQuery } from 'utils/clean-search-query'

import preSearchFormat from 'models/contacts/helpers/pre-search-format'

import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function searchContacts(
  searchText = '',
  attributeFilters,
  query = {
    ...defaultQuery,
    order: '-created_at',
    filter_type: 'and'
  },
  users,
  flows,
  crm_tasks
) {
  try {
    let payload = preSearchFormat({
      attributeFilters,
      crm_tasks,
      flows,
      query: searchText,
    })

    const request = new Fetch().post('/contacts/filter').query(query)

    if (Array.isArray(users) && users.length) {
      request.query(`users[]=${users.join('&users[]=')}`)
    }

    request.send(payload)

    const response = await request

    return response.body
  } catch (error) {
    throw error
  }
}
