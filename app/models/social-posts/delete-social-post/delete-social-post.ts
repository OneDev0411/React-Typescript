import Fetch from 'services/fetch'

export async function deleteSocialPost(
  brandId: UUID,
  socialPostId: UUID
): Promise<void> {
  await new Fetch().delete(`/brands/${brandId}/social-post/${socialPostId}`)
}
