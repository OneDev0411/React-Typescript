import Fetch from '../../../services/fetch'

export async function getGoogleAccountsSyncHistory(
  accountId: string
): Promise<IGoogleSyncHistory[]> {
  const response = await new Fetch()
    .get(`/users/self/google/sync_history/${accountId}`)
    .send()

  return response.body && response.body.data
}
