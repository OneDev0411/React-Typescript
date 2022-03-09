import Fetch from '@app/services/fetch'

export async function disconnectFacebookPage(facebookPageId): Promise<void> {
  await new Fetch().delete(`/users/self/facebook/${facebookPageId}`)
}
