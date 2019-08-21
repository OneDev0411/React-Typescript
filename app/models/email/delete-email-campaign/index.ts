import Fetch from 'services/fetch'

export function deleteEmailCampaign(id: string): Promise<any> {
  return new Fetch().delete(`/emails/${id}`)
}
