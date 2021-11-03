import useNotify from '@app/hooks/use-notify'
import updateSuperCampaignEnrollment from '@app/models/super-campaign/update-super-campaign-enrollment'

type UseUpdateSuperCampaignEnrollmentTags = (
  enrollmentId: UUID,
  tags: string[]
) => Promise<void>

export function useUpdateSuperCampaignEnrollmentTags(
  superCampaignId: UUID,
  superCampaignEnrollments: ISuperCampaignEnrollment<'user_and_brand'>[],
  setSuperCampaignEnrollments: (
    superCampaignEnrollments: ISuperCampaignEnrollment<'user_and_brand'>[]
  ) => void
): UseUpdateSuperCampaignEnrollmentTags {
  const notify = useNotify()

  const updateSuperCampaignEnrollmentTags = async (
    enrollmentId: UUID,
    tags: string[]
  ) => {
    try {
      const enrollmentIndex = superCampaignEnrollments.findIndex(
        enrollment => enrollment.id === enrollmentId
      )

      if (enrollmentIndex === -1) {
        return
      }

      const superCampaignEnrollment = superCampaignEnrollments[enrollmentIndex]

      await updateSuperCampaignEnrollment(superCampaignId, [
        {
          brand: superCampaignEnrollment.brand.id,
          user: superCampaignEnrollment.user.id,
          tags
        }
      ])

      const newSuperCampaignEnrollments = [...superCampaignEnrollments]

      newSuperCampaignEnrollments.splice(enrollmentIndex, 1, {
        ...superCampaignEnrollment,
        tags
      })

      setSuperCampaignEnrollments(newSuperCampaignEnrollments)
    } catch (_) {
      notify({
        status: 'error',
        message: 'Something went wrong while updating the tags'
      })
    }
  }

  return updateSuperCampaignEnrollmentTags
}
