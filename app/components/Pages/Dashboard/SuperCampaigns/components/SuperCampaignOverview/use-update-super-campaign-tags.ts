import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import updateSuperCampaignTagsModel from '@app/models/super-campaign/update-super-campaign-tags'

interface UseUpdateSuperCampaignTags {
  isSaving: boolean
  updateSuperCampaignTags: (tags: string[]) => Promise<void>
}

export function useUpdateSuperCampaignTags(
  superCampaign: ISuperCampaign<'template_instance'>,
  setSuperCampaign: (superCampaign: ISuperCampaign<'template_instance'>) => void
): UseUpdateSuperCampaignTags {
  const { isRunning, runActionThenNotify } = useRunActionThenNotify()

  const updateSuperCampaignTags = async (tags: string[]) =>
    runActionThenNotify(
      async () => {
        const updatedSuperCampaign = await updateSuperCampaignTagsModel(
          superCampaign.id,
          tags
        )

        setSuperCampaign({
          ...updatedSuperCampaign,
          template_instance: superCampaign.template_instance
        })
      },
      'The tags were updated',
      'Something went wrong while saving the tags. Please try again.'
    )

  return { isSaving: isRunning, updateSuperCampaignTags }
}
