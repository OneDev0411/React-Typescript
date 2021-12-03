import { getSuperCampaignDueAtRemainingTimeInMilliSeconds } from '../helpers'

export function useIsSuperCampaignDueAtTimeout(
  superCampaign: Pick<ISuperCampaign, 'due_at'>
): boolean {
  return (
    !!superCampaign.due_at &&
    getSuperCampaignDueAtRemainingTimeInMilliSeconds(superCampaign.due_at) < 0
  )
}
