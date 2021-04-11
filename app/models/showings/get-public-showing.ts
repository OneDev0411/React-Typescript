import Fetch from 'services/fetch'

export async function getPublicShowing(token: string): Promise<IPublicShowing> {
  const response = await new Fetch().get(`/showings/public/${token}`)

  return response.body.data
}
