import preSearchFormat from '../helpers/pre-search-format'

import Fetch from '../../../services/fetch'
import { associations as defaultAssociations } from '../helpers/default-query'

// TODO: refactor contacts models

export async function searchContacts(
  text: string = '',
  attributeFilters?: IContactAttributeFilter[],
  queryParams: IFetchContactQuery = {
    associations: [...defaultAssociations, 'contact.flows'],
    order: '-created_at',
    filter_type: 'and'
  },
  users?: UUID[],
  flows?: UUID[],
  crm_tasks?: UUID[],
  showings?: UUID[]
): Promise<ApiResponseBody<IContact[]>> {
  try {
    const [payload, query] = preSearchFormat({
      attributeFilters,
      crm_tasks,
      flows,
      text,
      users,
      queryParams,
      showings
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
