import Fetch from '@app/services/fetch'

import { GetSocialPostFilter } from '../types'

export async function getGetSocialPosts(
  brand: UUID,
  filter?: GetSocialPostFilter
): Promise<ISocialPost[]> {
  return (
    await new Fetch().get(`/brands/${brand}/social-post`).query({
      ...filter,
      associations: [
        // TODO: Add associations when it is ready
        // 'social_post.template_instance',
        // 'template_instance.template',
        // 'social_post.user'
      ]
    })
  ).body.data
}
