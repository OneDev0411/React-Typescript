export function useIsSuperCampaignExecuted(
  superCampaign: Pick<ISuperCampaign, 'executed_at'>
): boolean {
  return !!superCampaign.executed_at
}
