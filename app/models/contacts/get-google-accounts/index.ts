import Fetch from '../../../services/fetch'

export async function getGoogleAccounts(
  withHistory = false
): Promise<IGoogleAccount[]> {
  const response = await new Fetch()
    .get('/users/self/google')
    .query(withHistory ? { associations: 'google_credential.histories' } : {})
    .send()

  return response.body && response.body.data
}
