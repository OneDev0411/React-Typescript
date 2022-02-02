import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import { updateSuperCampaignEligibility as updateSuperCampaignEligibilityModel } from '@app/models/super-campaign'

type UseUpdateSuperCampaignEligibility = (
  eligibleBrands: UUID[]
) => Promise<void>

export function useUpdateSuperCampaignEligibility(
  superCampaign: ISuperCampaign<'template_instance'>,
  setSuperCampaign: (superCampaign: ISuperCampaign<'template_instance'>) => void
): UseUpdateSuperCampaignEligibility {
  const { runActionThenNotify } = useRunActionThenNotify()

  const updateSuperCampaignEligibility = async (eligibleBrands: UUID[]) =>
    runActionThenNotify(
      async () => {
        const updatedSuperCampaign = await updateSuperCampaignEligibilityModel(
          superCampaign.id,
          eligibleBrands
        )

        setSuperCampaign({
          ...updatedSuperCampaign,
          template_instance: superCampaign.template_instance
        })
      },
      'The eligible brands were updated',
      'Something went wrong while saving the eligible brands. Please try again.'
    )

  return updateSuperCampaignEligibility
}
