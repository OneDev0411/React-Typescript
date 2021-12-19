import { Dispatch, SetStateAction } from 'react'

import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
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
  const { runActionThenNotify } = useRunActionThenNotify()

  const addSuperCampaignEnrollment = async (
    data: ISuperCampaignEnrollmentInput[]
  ) =>
    runActionThenNotify(
      async () => {
        const enrollments = await enrollUserInSuperCampaign(
          superCampaignId,
          data
        )

        setSuperCampaignEnrollments(prevSuperCampaignEnrollments => [
          ...enrollments,
          ...prevSuperCampaignEnrollments
        ])
      },
      'The user was enrolled successfully',
      'Something went wrong while adding the enrollment'
    )

  return addSuperCampaignEnrollment
}
