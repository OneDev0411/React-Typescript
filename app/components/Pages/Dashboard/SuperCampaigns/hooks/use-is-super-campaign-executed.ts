export function useIsSuperCampaignExecuted(
  superCampaign: ISuperCampaign<'template_instance'>
): boolean {
  return !!superCampaign.executed_at
}
