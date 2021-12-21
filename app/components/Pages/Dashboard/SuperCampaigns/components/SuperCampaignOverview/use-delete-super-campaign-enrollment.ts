import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import deleteSuperCampaignEnrollmentModel from '@app/models/super-campaign/delete-super-campaign-enrollment'

type UseDeleteSuperCampaignEnrollment = (enrollmentId: UUID) => Promise<void>

export function useDeleteSuperCampaignEnrollment(
  superCampaignId: UUID,
  superCampaignEnrollments: ISuperCampaignEnrollment<'user' | 'brand'>[],
  setSuperCampaignEnrollments: (
    superCampaignEnrollments: ISuperCampaignEnrollment<'user' | 'brand'>[]
  ) => void
): UseDeleteSuperCampaignEnrollment {
  const { runActionThenNotify } = useRunActionThenNotify()

  const deleteSuperCampaignEnrollment = async (enrollmentId: UUID) =>
    runActionThenNotify(
      async () => {
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
      },
      'The enrollment was deleted',
      'Something went wrong while deleting the enrollment'
    )

  return deleteSuperCampaignEnrollment
}
