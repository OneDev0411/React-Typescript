import { useState } from 'react'

import useNotify from '@app/hooks/use-notify'
import updateSuperCampaign from '@app/models/super-campaign/update-super-campaign'

interface SaveSuperCampaignInput
  extends Omit<ISuperCampaignInput, 'template_instance'> {
  template_instance: IMarketingTemplateInstance
}

interface UseSaveSuperCampaign {
  isSaving: boolean
  saveSuperCampaign: (
    superCampaignData: Partial<SaveSuperCampaignInput>
  ) => Promise<void>
}

export function useSaveSuperCampaign(
  superCampaign: ISuperCampaign<'template_instance'>,
  setSuperCampaign: (superCampaign: ISuperCampaign<'template_instance'>) => void
): UseSaveSuperCampaign {
  const [isSaving, setIsSaving] = useState(false)
  const notify = useNotify()

  const saveSuperCampaign = async (
    superCampaignData: Partial<SaveSuperCampaignInput>
  ) => {
    setIsSaving(true)

    try {
      const updatedSuperCampaign = await updateSuperCampaign(superCampaign.id, {
        subject: superCampaignData.subject ?? superCampaign.subject,
        description: superCampaignData.description ?? superCampaign.description,
        due_at: superCampaignData.due_at ?? superCampaign.due_at,
        template_instance:
          superCampaignData.template_instance?.id ??
          superCampaign.template_instance.id
      })

      setSuperCampaign({
        ...updatedSuperCampaign,
        template_instance:
          superCampaignData.template_instance ?? superCampaign.template_instance
      })

      notify({
        status: 'success',
        message: 'The super campaign was updated'
      })
    } catch (_) {
      notify({
        status: 'error',
        message:
          'Something went wrong while saving the super campaign. Please try again.'
      })
    }

    setIsSaving(false)
  }

  return { isSaving, saveSuperCampaign }
}
