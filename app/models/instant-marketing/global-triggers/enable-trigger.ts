import Fetch from '../../../services/fetch'

import { DEFAULT_QUERY } from './helpers/constant'

export async function enableTrigger(
  triggerId: UUID,
  brandId: UUID,
  query: object = DEFAULT_QUERY
): Promise<IGlobalTrigger<'template' | 'template_instance'>> {
  try {
    const response = await new Fetch()
      .patch(`/brands/${brandId}/triggers/${triggerId}/enable`)
      .query(query)

    return response.body.data
  } catch (e) {
    throw e
  }
}
