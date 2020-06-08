import Fetch from '../../../services/fetch'

export async function getOAuthAccounts(
  provider: string,
  withJobs = false
): Promise<IOAuthAccount[]> {
  const response = await new Fetch()
    .get(`/users/self/${provider}`)
    .query(withJobs ? { associations: `${provider}_credential.jobs` } : {})
    .send()

  const accounts: IOAuthAccount[] = (response.body && response.body.data) || []

  // The logic related to showing or not showing deleted accounts or revoked
  // may be subject to change in future.
  return accounts
}
