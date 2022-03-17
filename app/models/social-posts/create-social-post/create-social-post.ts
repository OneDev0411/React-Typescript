import Fetch from '@app/services/fetch'

export async function createSocialPost(
  brand: UUID,
  data: ISocialPostInput
): Promise<ISocialPost> {
  return (await new Fetch().post(`/brands/${brand}/social-post`).send(data))
    .body.data
}
