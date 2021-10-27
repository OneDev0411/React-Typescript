export function useIsSuperCampaignResultMode(
  superCampaign: ISuperCampaign<'template_instance'>
): boolean {
  return !!superCampaign.executed_at
}
