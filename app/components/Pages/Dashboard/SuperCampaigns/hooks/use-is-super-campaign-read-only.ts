import { useIsSuperCampaignDueAtTimeout } from './use-is-super-campaign-due-at-timeout'
import { useIsSuperCampaignExecuted } from './use-is-super-campaign-executed'

export function useIsSuperCampaignReadOnly(
  superCampaign: Pick<ISuperCampaign, 'executed_at' | 'due_at'>
): boolean {
  const isExecuted = useIsSuperCampaignExecuted(superCampaign)
  const isDueAtTimeout = useIsSuperCampaignDueAtTimeout(superCampaign)

  return isExecuted || isDueAtTimeout
}
