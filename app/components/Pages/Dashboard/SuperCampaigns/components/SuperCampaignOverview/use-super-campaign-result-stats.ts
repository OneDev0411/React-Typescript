import { useMemo } from 'react'

interface UseSuperCampaignResultStats {
  totalSent: number
  totalDelivered: number
  totalOpened: number
  totalClicked: number
}

export function useSuperCampaignResultStats(
  superCampaignResults: ISuperCampaignEnrollment<
    'user' | 'brand' | 'campaign'
  >[]
): UseSuperCampaignResultStats {
  return useMemo<UseSuperCampaignResultStats>(
    () =>
      superCampaignResults.reduce(
        (stats, enrollment) => {
          if (!enrollment.campaign) {
            return stats
          }

          return {
            totalSent: stats.totalSent + enrollment.campaign.sent,
            totalDelivered:
              stats.totalDelivered + enrollment.campaign.delivered,
            totalOpened: stats.totalOpened + enrollment.campaign.opened,
            totalClicked: stats.totalClicked + enrollment.campaign.clicked
          }
        },
        {
          totalSent: 0,
          totalDelivered: 0,
          totalOpened: 0,
          totalClicked: 0
        }
      ),
    [superCampaignResults]
  )
}
