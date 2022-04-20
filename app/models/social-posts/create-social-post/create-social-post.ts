import Fetch from '@app/services/fetch'

export async function createSocialPost(
  brand: UUID,
  data: ISocialPostInput
): Promise<ISocialPost> {
  return (
    (
      await new Fetch()
        .post(`/brands/${brand}/social-post`)
        // TODO: Ask API guys to use the same patterns as get method for date
        .send({ ...data, due_at: data.due_at * 1000 })
    ).body.data
  )
}
