import preSearchFormat from '../helpers/pre-search-format'

import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function searchContacts(
  text = '',
  attributeFilters,
  queryParams = {
    ...defaultQuery,
    order: '-created_at',
    filter_type: 'and'
  },
  users,
  flows,
  crm_tasks
) {
  try {
    const [payload, query] = preSearchFormat({
      attributeFilters,
      crm_tasks,
      flows,
      text,
      users,
      queryParams
    })

    const response = await new Fetch()
      .post('/contacts/filter')
      .query(query)
      .send(payload)

    return response.body
  } catch (error) {
    throw error
  }
}
