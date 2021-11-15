import Fetch from '../../../services/fetch'

// import { DEFAULT_QUERY } from './helpers/constant'

export async function excludeContactFromGlobalTrigger(
  contactId: UUID,
  eventType: TriggerContactEventTypes,
  brandId: UUID
): Promise<IGlobalTrigger> {
  try {
    const response = await new Fetch()
      .post(`/brands/${brandId}/triggers/${eventType}/exclusion`)
      .send({
        contact: contactId
      })

    console.log({ exclude: response.body.data })

    return response.body.data
  } catch (e) {
    throw e
  }
}
