import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import { updateSuperCampaign } from '@app/models/super-campaign'

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
  const { isRunning, runActionThenNotify } = useRunActionThenNotify()

  const saveSuperCampaign = async (
    superCampaignData: Partial<SaveSuperCampaignInput>
  ) =>
    runActionThenNotify(
      async () => {
        const updatedSuperCampaign = await updateSuperCampaign(
          superCampaign.id,
          {
            subject: superCampaignData.subject ?? superCampaign.subject,
            description:
              superCampaignData.description ?? superCampaign.description,
            // The undefined value is acceptable for due_at field so we have to
            // check if the key exists instead of value
            due_at:
              'due_at' in superCampaignData
                ? superCampaignData.due_at
                : superCampaign.due_at,
            template_instance:
              superCampaignData.template_instance?.id ??
              superCampaign.template_instance?.id
          }
        )

        setSuperCampaign({
          ...updatedSuperCampaign,
          template_instance:
            superCampaignData.template_instance ??
            superCampaign.template_instance
        })
      },
      'The campaign was updated',
      'Something went wrong while saving the campaign. Please try again.'
    )

  return { isSaving: isRunning, saveSuperCampaign }
}
