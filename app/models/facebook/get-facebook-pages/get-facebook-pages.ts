import Fetch from '@app/services/fetch'

export async function getFacebookPages(
  brandId: UUID
): Promise<IFacebookPage[]> {
  return (await new Fetch().get(`/brands/${brandId}/users/self/facebook`)).body
    .data
}
