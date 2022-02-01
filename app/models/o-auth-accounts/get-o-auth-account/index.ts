import Fetch from 'services/fetch'

export async function getOAuthAccount(
  provider: string,
  accountId: string,
  withJobs = false
): Promise<Nullable<IOAuthAccount>> {
  try {
    const response = await new Fetch()
      .get(`/users/self/${provider}/${accountId}`)
      .query(withJobs ? { associations: `${provider}_credential.jobs` } : {})
      .send()

    return response.body && response.body.data
  } catch (e) {
    return null
  }
}
