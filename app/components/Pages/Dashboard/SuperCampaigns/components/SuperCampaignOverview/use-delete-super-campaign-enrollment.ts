import { Dispatch, SetStateAction } from 'react'

import useNotify from '@app/hooks/use-notify'

type UseDeleteSuperCampaignEnrollment = (enrollmentId: UUID) => Promise<void>

export function useDeleteSuperCampaignEnrollment(
  setSuperCampaignEnrollments: Dispatch<
    SetStateAction<ISuperCampaignEnrollment<'user_and_brand'>[]>
  >
): UseDeleteSuperCampaignEnrollment {
  const notify = useNotify()

  const deleteSuperCampaignEnrollment = async (enrollmentId: UUID) => {
    try {
      // TODO: call delete model for the enrollment
      console.log('delete')

      setSuperCampaignEnrollments(superCampaignEnrollments => {
        const enrollmentIndex = superCampaignEnrollments.findIndex(
          enrollment => enrollment.id === enrollmentId
        )

        if (enrollmentIndex === -1) {
          return superCampaignEnrollments
        }

        const newSuperCampaignEnrollments = [...superCampaignEnrollments]

        newSuperCampaignEnrollments.splice(enrollmentIndex, 1)

        return newSuperCampaignEnrollments
      })
    } catch (_) {
      notify({
        status: 'error',
        message: 'Something went wrong while deleting the enrollment'
      })
    }
  }

  return deleteSuperCampaignEnrollment
}
