import { negate } from 'lodash'

import { cleanSearchQuery } from '../../../utils/clean-search-query'

import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function searchContacts(
  searchText = '',
  filter,
  query = {
    ...defaultQuery,
    order: '-created_at',
    filter_type: 'and'
  },
  users
) {
  try {
    const payload = {}

    const q = cleanSearchQuery(searchText.trim())

    const request = new Fetch().post('/contacts/filter').query(query)

    if (q.length > 0) {
      payload.query = q
    }

    if (Array.isArray(filter) && filter.length > 0) {
      payload.crm_task = filter
        .filter(filter => filter.crm_task)
        .map(({ crm_task }) => crm_task)

      payload.flows = filter
        .filter(filter => filter.flow)
        .map(({ flow }) => flow)

      payload.filter = filter
        .filter(filter => filter.attribute_def)
        .map(({ attribute_def, invert, operator, value }) => ({
          attribute_def,
          invert,
          operator,
          value
        }))
    }

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
