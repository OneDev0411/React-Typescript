import { useMemo } from 'react'

import { useLocation } from 'react-use'

import { useHasSuperCampaignAccess } from '../../SuperCampaigns/hooks/use-has-super-campaign-access'
import { EmailCampaignStatus, PageTabStats } from '../types'

export function usePageTabs(
  badgeCounters?: PageTabStats
): [typeof list, Nullable<EmailCampaignStatus>] {
  const hasSuperCampaignAccess = useHasSuperCampaignAccess()
  const location = useLocation()

  const list = useMemo(() => {
    let list: {
      label: string
      value: Nullable<EmailCampaignStatus>
      badgeCounter?: number
      to: string
    }[] = [
      {
        label: 'Sent',
        value: 'executed',
        badgeCounter: badgeCounters?.executed,
        to: '/dashboard/insights'
      },
      {
        label: 'Scheduled',
        value: 'scheduled',
        badgeCounter: badgeCounters?.scheduled,
        to: '/dashboard/insights/scheduled'
      },
      {
        label: 'Instagram',
        value: null,
        to: '/dashboard/insights/social-post'
      }
    ]

    if (hasSuperCampaignAccess) {
      list = [
        ...list,
        {
          label: 'Campaigns',
          value: null,
          to: '/dashboard/insights/super-campaign'
        }
      ]
    }

    return list
  }, [badgeCounters, hasSuperCampaignAccess])

  const activeTab = useMemo(() => {
    return list.find(tab => tab.to === location.pathname)?.value ?? null
  }, [list, location.pathname])

  return [list, activeTab]
}
