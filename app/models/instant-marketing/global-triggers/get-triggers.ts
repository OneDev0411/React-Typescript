import { Response } from 'superagent'

import Fetch from '../../../services/fetch'

import { DEFAULT_QUERY } from './helpers/constant'

export async function getTriggers(
  brandId: UUID,
  query: object = DEFAULT_QUERY
): Promise<IGlobalTrigger<'template' | 'template_instance'>[]> {
  try {
    const response: Response = await new Fetch()
      .get(`/brands/${brandId}/triggers`)
      .query(query)

    return response.body.data
  } catch (e) {
    throw e
  }
}
