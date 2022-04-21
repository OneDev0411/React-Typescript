import Fetch from '@app/services/fetch'

export async function disconnectFacebookPage(
  brandId: string,
  facebookPageId: UUID
): Promise<void> {
  await new Fetch().delete(
    `/brands/${brandId}/users/self/facebook/${facebookPageId}`
  )
}
