import Fetch from '@app/services/fetch'

export async function getFacebookPages(): Promise<IFacebookPage[]> {
  return (await new Fetch().get('/users/self/facebook')).body.data
}
