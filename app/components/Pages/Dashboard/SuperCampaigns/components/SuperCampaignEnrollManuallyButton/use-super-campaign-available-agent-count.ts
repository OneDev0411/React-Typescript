import { useDeepCompareEffect } from 'react-use'

import useAsync from '@app/hooks/use-async'

export function useSuperCampaignAvailableAgentCount(
  teamAgentsModelFn: () => Promise<IBrand[]>,
  enrolledAgentCount: number,
  eligibleBrands: Nullable<string[]>,
  superCampaignTags: Nullable<string[]>
): number {
  const {
    run,
    data: totalAgentCount,
    isLoading
  } = useAsync({ data: 0, status: 'pending' })

  useDeepCompareEffect(() => {
    run(async () => {
      const brands = await teamAgentsModelFn()

      // Count all users in all brands
      return brands.reduce((totalAgentCount, brand) => {
        if (!brand || !brand.roles) {
          return totalAgentCount
        }

        return (
          totalAgentCount +
          // Count all users in the brand
          brand.roles.reduce((brandUsersCount, role) => {
            if (!role.users) {
              return brandUsersCount
            }

            return brandUsersCount + role.users.length
          }, 0)
        )
      }, 0)
    })
  }, [run, teamAgentsModelFn, eligibleBrands, superCampaignTags])

  if (isLoading) {
    return 0
  }

  return Math.max(totalAgentCount - enrolledAgentCount, 0) // Do not return a negative value
}
