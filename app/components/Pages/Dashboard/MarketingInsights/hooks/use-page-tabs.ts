import { useMemo } from 'react'

import { useLocation } from 'react-use'

import { useHasSuperCampaignAccess } from '../../SuperCampaigns/hooks/use-has-super-campaign-access'
import { PageTabStats } from '../types'

export function usePageTabs(
  stats?: PageTabStats
): [typeof list, string | undefined] {
  const hasSuperCampaignAccess = useHasSuperCampaignAccess()
  const location = useLocation()

  const list = useMemo(() => {
    let list = [
      {
        label: 'Sent',
        value: 'executed',
        badgeCounter: stats?.executed,
        to: '/dashboard/insights'
      },
      {
        label: 'Scheduled',
        value: 'scheduled',
        badgeCounter: stats?.scheduled,
        to: '/dashboard/insights/scheduled'
      },
      {
        label: 'Instagram',
        value: 'social-post',
        to: '/dashboard/insights/social-post'
      }
    ]

    if (hasSuperCampaignAccess) {
      list = [
        ...list,
        {
          label: 'Campaigns',
          value: 'super-campaign',
          to: '/dashboard/insights/super-campaign'
        }
      ]
    }

    return list
  }, [stats, hasSuperCampaignAccess])

  const activeTab = useMemo(() => {
    return list.find(tab => tab.to === location.pathname)?.value
  }, [list, location.pathname])

  return [list, activeTab]
}
