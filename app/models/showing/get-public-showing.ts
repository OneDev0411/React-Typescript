import Fetch from 'services/fetch'

export async function getPublicShowing(
  numericId: number
): Promise<IPublicShowing> {
  const response = await new Fetch()
    .get(`/showings/public/${numericId}`)
    .query({
      'associations[]': ['agent.office']
    })

  return response.body.data
}
