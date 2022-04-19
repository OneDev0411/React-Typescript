import Fetch from '@app/services/fetch'

import { GetSocialPostFilter } from '../types'

export async function getGetSocialPosts(
  brand: UUID,
  filter?: GetSocialPostFilter
): Promise<ISocialPost<'template_instance' | 'owner'>[]> {
  return (
    await new Fetch().get(`/brands/${brand}/social-post`).query({
      ...filter,
      associations: [
        'social_post.template_instance',
        'template_instance.template',
        'social_post.owner'
      ]
    })
  ).body.data
}
