import { Dispatch, SetStateAction } from 'react'

import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import { enrollUserInSuperCampaign } from '@app/models/super-campaign'

type UseAddSuperCampaignEnrollment = (
  data: ISuperCampaignEnrollmentInput[]
) => Promise<void>

export function useEnrollUserInSuperCampaign(
  superCampaignId: UUID,
  setSuperCampaignEnrollments: Dispatch<
    SetStateAction<ISuperCampaignEnrollment<'user' | 'brand'>[]>
  >
): UseAddSuperCampaignEnrollment {
  const { runActionThenNotify } = useRunActionThenNotify()

  const addSuperCampaignEnrollment = async (
    data: ISuperCampaignEnrollmentInput[]
  ) =>
    runActionThenNotify(
      async () => {
        const newEnrollments = await enrollUserInSuperCampaign(
          superCampaignId,
          data
        )

        setSuperCampaignEnrollments(prevEnrollments => {
          return [
            // Append the new items on the top but exclude the existing ones to avoid duplications
            ...newEnrollments.filter(
              newEnrollment =>
                !prevEnrollments.find(
                  prevEnrollment => prevEnrollment.id === newEnrollment.id
                )
            ),
            // Update the existing items and replace them with a new one if there is
            ...prevEnrollments.map(prevEnrollment => {
              const newEnrollment = newEnrollments.find(
                item => item.id === prevEnrollment.id
              )

              if (newEnrollment) {
                return newEnrollment
              }

              return prevEnrollment
            })
          ]
        })
      },
      'The user was enrolled successfully',
      'Something went wrong while adding the enrollment'
    )

  return addSuperCampaignEnrollment
}
