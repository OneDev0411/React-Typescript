import Fetch from 'services/fetch'

export type UpdateSocialPostInput = Pick<ISocialPostInput, 'due_at'>

export async function updateSocialPost(
  brandId: UUID,
  socialPostId: UUID,
  data: Pick<ISocialPostInput, 'due_at'>
): Promise<ISocialPost> {
  return (
    (
      await new Fetch()
        .put(`/brands/${brandId}/social-post/${socialPostId}`)
        // TODO: Ask API guys to:
        // 1. Use the same patterns as create social record -> Needs to change dueAt to due_at
        // 2. Have consistant types on get and post methods. -> Seems like the get is in seconds and the put is in milliseconds
        .send({ dueAt: data.due_at * 1000 })
    ).body.data
  )
}
