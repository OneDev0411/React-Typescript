import { useIsSuperCampaignDueAtTimeout } from './use-is-super-campaign-due-at-timeout'
import { useIsSuperCampaignExecuted } from './use-is-super-campaign-executed'

export function useIsSuperCampaignExecutedOrDueAtTimeout(
  superCampaign: ISuperCampaign<'template_instance'>
): boolean {
  const isExecuted = useIsSuperCampaignExecuted(superCampaign)
  const isDueAtTimeout = useIsSuperCampaignDueAtTimeout(superCampaign)

  return isExecuted || isDueAtTimeout
}
