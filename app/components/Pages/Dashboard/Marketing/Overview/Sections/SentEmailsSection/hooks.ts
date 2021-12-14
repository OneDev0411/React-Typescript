import { useState, useEffect } from 'react'

import { useUnsafeActiveBrandId } from 'hooks/brand/use-unsafe-active-brand-id'
import { useLoadingEntities } from 'hooks/use-loading'
import { getEmailCampaigns } from 'models/email/get-email-campaigns'

type EmailCampaign = IEmailCampaign<'recipients' | 'template', 'list', 'email'>

interface UseEmailCampaigns {
  isLoading: boolean
  campaigns: Nullable<EmailCampaign[]>
}

export function useEmailCampaigns(): UseEmailCampaigns {
  const activeBrandId = useUnsafeActiveBrandId()
  const [campaigns, setCampaigns] = useState<Nullable<EmailCampaign[]>>(null)
  const [isLoading] = useLoadingEntities(campaigns)

  useEffect(() => {
    async function fetchEmailCampaigns() {
      const emailCampaigns = await getEmailCampaigns(activeBrandId, {
        emailCampaignAssociations: ['recipients', 'template'],
        emailRecipientsAssociations: ['list'],
        emailCampaignEmailsAssociation: ['email']
      })

      setCampaigns(
        emailCampaigns.filter(
          campaign => !!campaign.template && !!campaign.executed_at
        )
      )
    }

    fetchEmailCampaigns()
  }, [activeBrandId])

  return {
    isLoading,
    campaigns
  }
}
