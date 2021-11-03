import { Dispatch, SetStateAction } from 'react'

import useNotify from '@app/hooks/use-notify'
import enrollUserInSuperCampaign from '@app/models/super-campaign/enroll-user-in-super-campaign'

type UseAddSuperCampaignEnrollment = (
  data: ISuperCampaignEnrollmentInput[]
) => Promise<void>

export function useAddSuperCampaignEnrollment(
  superCampaignId: UUID,
  setSuperCampaignEnrollments: Dispatch<
    SetStateAction<ISuperCampaignEnrollment<'user_and_brand'>[]>
  >
): UseAddSuperCampaignEnrollment {
  const notify = useNotify()

  const addSuperCampaignEnrollment = async (
    data: ISuperCampaignEnrollmentInput[]
  ) => {
    try {
      const enrollments = await enrollUserInSuperCampaign(superCampaignId, data)

      setSuperCampaignEnrollments(prevSuperCampaignEnrollments => [
        ...enrollments,
        ...prevSuperCampaignEnrollments
      ])

      notify({
        status: 'success',
        message: 'The user was enrolled successfully'
      })
    } catch (_) {
      notify({
        status: 'error',
        message: 'Something went wrong while adding the enrollment'
      })
    }
  }

  return addSuperCampaignEnrollment
}
