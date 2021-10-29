import useNotify from '@app/hooks/use-notify'
import updateSuperCampaignEligibilityModel from '@app/models/super-campaign/update-super-campaign-eligibility'

type UseUpdateSuperCampaignEligibility = (
  eligibleBrands: UUID[]
) => Promise<void>

export function useUpdateSuperCampaignEligibility(
  superCampaign: ISuperCampaign<'template_instance'>,
  setSuperCampaign: (superCampaign: ISuperCampaign<'template_instance'>) => void
): UseUpdateSuperCampaignEligibility {
  const notify = useNotify()

  const updateSuperCampaignEligibility = async (eligibleBrands: UUID[]) => {
    try {
      const updatedSuperCampaign = await updateSuperCampaignEligibilityModel(
        superCampaign.id,
        eligibleBrands
      )

      setSuperCampaign({
        ...updatedSuperCampaign,
        template_instance: superCampaign.template_instance
      })

      notify({
        status: 'success',
        message: 'The eligible brands were updated'
      })
    } catch (_) {
      notify({
        status: 'error',
        message:
          'Something went wrong while saving the eligible brands. Please try again.'
      })
    }
  }

  return updateSuperCampaignEligibility
}
