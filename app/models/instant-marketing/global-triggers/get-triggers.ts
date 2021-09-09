import { Response } from 'superagent'

import Fetch from '../../../services/fetch'

export async function getTriggers(brandId: UUID): Promise<IGlobalTrigger[]> {
  try {
    const response: Response = await new Fetch()
      .get(`/brands/${brandId}/triggers`)
      .query({
        associations: [
          'brand_trigger.template',
          'brand_trigger.template_instance',
          'template_instance.template'
        ]
      })

    return response.body.data
  } catch (e) {
    throw e
  }
}
