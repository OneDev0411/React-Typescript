import Fetch from '../../../services/fetch'

export async function getMlsAreas(): Promise<IMLSArea[]> {
  try {
    const response = await new Fetch().get('/areas/search?parents[]=0')

    return response.body.data
  } catch (error) {
    throw error
  }
}
