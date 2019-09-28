import Fetch from '../../../services/fetch'

export async function getMlsSubAreas(areas: number[]): Promise<IMLSArea[]> {
  try {
    const response = await new Fetch().get('/areas/search').query({
      'parents[]': areas
    })

    return response.body.data
  } catch (error) {
    throw error
  }
}
