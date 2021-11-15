import Fetch from '../../../services/fetch'

export async function excludeContactFromGlobalTrigger(
  contactId: UUID,
  eventType: TriggerContactEventTypes,
  brandId: UUID
): Promise<void> {
  try {
    await new Fetch()
      .post(`/brands/${brandId}/triggers/${eventType}/exclusion`)
      .send({
        contact: contactId
      })
  } catch (e) {
    throw e
  }
}
