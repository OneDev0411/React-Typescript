import Fetch from 'services/fetch'

export async function getPublicShowing(token: string): Promise<IPublicShowing> {
  const response = await new Fetch().get(`/showings/public/${token}`).query({
    'associations[]': ['agent.office']
  })

  return response.body.data
}
