import Fetch from '../../../services/fetch'

export async function enableTrigger(
  triggerId: UUID,
  brandId: UUID
): Promise<IGlobalTrigger> {
  try {
    const response = await new Fetch()
      .patch(`/brands/${brandId}/triggers/${triggerId}/enable`)
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
