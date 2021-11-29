import { getSuperCampaignDueAtRemainingTimeInMilliSeconds } from '../helpers'

export function useIsSuperCampaignDueAtTimeout(
  superCampaign: ISuperCampaign<'template_instance'>
): boolean {
  return (
    !!superCampaign.due_at &&
    getSuperCampaignDueAtRemainingTimeInMilliSeconds(superCampaign.due_at) < 0
  )
}
