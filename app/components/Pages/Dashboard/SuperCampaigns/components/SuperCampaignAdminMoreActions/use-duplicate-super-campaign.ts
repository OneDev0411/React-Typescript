import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import { createSuperCampaign } from '@app/models/super-campaign'

interface UseDuplicateSuperCampaign {
  isDuplicating: boolean
  duplicateSuperCampaign: () => void
}

export function useDuplicateSuperCampaign(
  superCampaign: ISuperCampaign,
  onDuplicate: (superCampaign: ISuperCampaign) => void
): UseDuplicateSuperCampaign {
  const { isRunning, runActionThenNotify } = useRunActionThenNotify()

  const duplicateSuperCampaign = () => {
    runActionThenNotify(
      async () => {
        const newSuperCampaign = await createSuperCampaign({
          subject: superCampaign.subject,
          description: superCampaign.description,
          template_instance: superCampaign.template_instance,
          tags: superCampaign.tags ?? undefined,
          eligible_brands: superCampaign.eligible_brands ?? undefined
        })

        onDuplicate(newSuperCampaign)
      },
      'The campaign was duplicated',
      'Something went wrong while duplicating the campaign. Please try again.'
    )
  }

  return {
    isDuplicating: isRunning,
    duplicateSuperCampaign
  }
}
