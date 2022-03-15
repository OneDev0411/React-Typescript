import Fetch from '@app/services/fetch'

export async function createSocialPost(
  data: ISocialPostInput
): Promise<ISocialPost> {
  return (await new Fetch().post('/email/super-post').send(data)).body.data
}
