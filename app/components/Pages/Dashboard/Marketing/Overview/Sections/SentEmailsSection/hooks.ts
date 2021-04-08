import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getEmailCampaigns } from 'models/email/get-email-campaigns'
import { useLoadingEntities } from 'hooks/use-loading'
import { selectUser } from 'selectors/user'

type EmailCampaign = IEmailCampaign<'recipients' | 'template', 'list', 'email'>

interface UseEmailCampaigns {
  isLoading: boolean
  campaigns: Nullable<EmailCampaign[]>
}

export function useEmailCampaigns(): UseEmailCampaigns {
  const user = useSelector(selectUser)
  const [campaigns, setCampaigns] = useState<Nullable<EmailCampaign[]>>(null)
  const [isLoading] = useLoadingEntities(campaigns)

  useEffect(() => {
    async function fetchEmailCampaigns() {
      const emailCampaigns = await getEmailCampaigns(user, {
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
  }, [user])

  return {
    isLoading,
    campaigns
  }
}
