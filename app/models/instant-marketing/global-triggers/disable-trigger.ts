import Fetch from '../../../services/fetch'

export async function disableTrigger(
  triggerId: UUID,
  brandId: UUID
): Promise<IGlobalTrigger> {
  try {
    const response = await new Fetch()
      .patch(`/brands/${brandId}/triggers/${triggerId}/disable`)
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
