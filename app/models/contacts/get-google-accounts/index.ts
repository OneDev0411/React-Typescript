import Fetch from '../../../services/fetch'

export async function getGoogleAccounts(): Promise<IGoogleAccount[]> {
  const response = await new Fetch().get('/users/self/google').send()

  return response.body && response.body.data
}
