import Fetch from '../../../services/fetch'

export async function createTrigger(
  payload: IGlobalTriggerInput
): Promise<ApiResponseBody<IGlobalTrigger>> {
  try {
    if (!payload.brand) {
      throw new Error('Brand not provided')
    }

    if (!payload.event_type) {
      throw new Error('EventType not provided')
    }

    /* because the end point accept a negative value that
     shows the time before the main date */
    if (!('wait_for' in payload) || payload.wait_for > 0) {
      throw new Error('invalid wait_for value')
    }

    const response = await new Fetch()
      .put(`/brands/${payload.brand}/triggers/${payload.event_type}`)
      .send(payload)

    return response.body
  } catch (e) {
    throw e
  }
}
