import { Dispatch, SetStateAction } from 'react'

import useNotify from '@app/hooks/use-notify'

type UseUpdateSuperCampaignEnrollmentTags = (
  enrollmentId: UUID,
  tags: string[]
) => Promise<void>

export function useUpdateSuperCampaignEnrollmentTags(
  setSuperCampaignEnrollments: Dispatch<
    SetStateAction<ISuperCampaignEnrollment<'user_and_brand'>[]>
  >
): UseUpdateSuperCampaignEnrollmentTags {
  const notify = useNotify()

  const updateSuperCampaignEnrollmentTags = async (
    enrollmentId: UUID,
    tags: string[]
  ) => {
    try {
      // TODO: call update tags model for the enrollment

      setSuperCampaignEnrollments(superCampaignEnrollments => {
        const enrollmentIndex = superCampaignEnrollments.findIndex(
          enrollment => enrollment.id === enrollmentId
        )

        if (enrollmentIndex === -1) {
          return superCampaignEnrollments
        }

        const newSuperCampaignEnrollments = [...superCampaignEnrollments]

        newSuperCampaignEnrollments.splice(enrollmentIndex, 1, {
          ...newSuperCampaignEnrollments[enrollmentIndex],
          tags
        })

        return newSuperCampaignEnrollments
      })
    } catch (_) {
      notify({
        status: 'error',
        message: 'Something went wrong while updating the tags'
      })
    }
  }

  return updateSuperCampaignEnrollmentTags
}
