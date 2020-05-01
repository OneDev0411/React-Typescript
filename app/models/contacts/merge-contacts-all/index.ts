import Fetch from '../../../services/fetch'

export async function mergeContactsAll(): Promise<ApiResponseBody<unknown>> {
  const response = await new Fetch().post('/contacts/merge/all').send()

  return response.body.data
}
