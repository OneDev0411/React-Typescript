import useNotify from '@app/hooks/use-notify'
import useSafeState from '@app/hooks/use-safe-state'
import updateSuperCampaignTagsModel from '@app/models/super-campaign/update-super-campaign-tags'

interface UseUpdateSuperCampaignTags {
  isSaving: boolean
  updateSuperCampaignTags: (tags: string[]) => Promise<void>
}

export function useUpdateSuperCampaignTags(
  superCampaign: ISuperCampaign<'template_instance'>,
  setSuperCampaign: (superCampaign: ISuperCampaign<'template_instance'>) => void
): UseUpdateSuperCampaignTags {
  const notify = useNotify()
  const [isSaving, setIsSaving] = useSafeState(false)

  const updateSuperCampaignTags = async (tags: string[]) => {
    setIsSaving(true)

    try {
      const updatedSuperCampaign = await updateSuperCampaignTagsModel(
        superCampaign.id,
        tags
      )

      setSuperCampaign({
        ...updatedSuperCampaign,
        template_instance: superCampaign.template_instance
      })

      notify({
        status: 'success',
        message: 'The tags were updated'
      })
    } catch (_) {
      notify({
        status: 'error',
        message: 'Something went wrong while saving the tags. Please try again.'
      })
    }

    setIsSaving(false)
  }

  return { isSaving, updateSuperCampaignTags }
}
