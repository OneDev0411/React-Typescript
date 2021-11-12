import useNotify from '@app/hooks/use-notify'
import deleteSuperCampaignEnrollmentModel from '@app/models/super-campaign/delete-super-campaign-enrollment'

type UseDeleteSuperCampaignEnrollment = (enrollmentId: UUID) => Promise<void>

export function useDeleteSuperCampaignEnrollment(
  superCampaignId: UUID,
  superCampaignEnrollments: ISuperCampaignEnrollment<'user_and_brand'>[],
  setSuperCampaignEnrollments: (
    superCampaignEnrollments: ISuperCampaignEnrollment<'user_and_brand'>[]
  ) => void
): UseDeleteSuperCampaignEnrollment {
  const notify = useNotify()

  const deleteSuperCampaignEnrollment = async (enrollmentId: UUID) => {
    try {
      const enrollmentIndex = superCampaignEnrollments.findIndex(
        enrollment => enrollment.id === enrollmentId
      )

      if (enrollmentIndex === -1) {
        return
      }

      const enrollment = superCampaignEnrollments[enrollmentIndex]

      await deleteSuperCampaignEnrollmentModel(superCampaignId, {
        user: enrollment.user.id,
        brand: enrollment.brand.id
      })

      const newSuperCampaignEnrollments = [...superCampaignEnrollments]

      newSuperCampaignEnrollments.splice(enrollmentIndex, 1, {
        ...enrollment,
        deleted_at: new Date().getTime() / 1000
      })

      setSuperCampaignEnrollments(newSuperCampaignEnrollments)
    } catch (_) {
      notify({
        status: 'error',
        message: 'Something went wrong while deleting the enrollment'
      })
    }
  }

  return deleteSuperCampaignEnrollment
}
