import { useQueryParam } from '@app/hooks/use-query-param'

export function useGetSuperCampaignBackUrl(): string {
  const [backUrl] = useQueryParam('backUrl')

  return backUrl || '/dashboard/insights/super-campaign'
}
