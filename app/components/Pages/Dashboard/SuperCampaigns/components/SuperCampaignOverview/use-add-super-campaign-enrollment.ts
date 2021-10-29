import { Dispatch, SetStateAction } from 'react'

import useNotify from '@app/hooks/use-notify'
import enrollUserInSuperCampaign from '@app/models/super-campaign/enroll-user-in-super-campaign'

import { SuperCampaignEnrollmentInput } from '../../types'

type UseAddSuperCampaignEnrollment = (
  data: SuperCampaignEnrollmentInput
) => Promise<void>

export function useAddSuperCampaignEnrollment(
  superCampaignId: UUID,
  setSuperCampaignEnrollments: Dispatch<
    SetStateAction<ISuperCampaignEnrollment<'user_and_brand'>[]>
  >
): UseAddSuperCampaignEnrollment {
  const notify = useNotify()

  const addSuperCampaignEnrollment = async (
    data: SuperCampaignEnrollmentInput
  ) => {
    try {
      const enrollment = await enrollUserInSuperCampaign(superCampaignId, {
        user: data.user.id,
        brand: data.brand.id,
        tags: data.tags
      })

      setSuperCampaignEnrollments(superCampaignEnrollments => [
        { ...enrollment, ...data },
        ...superCampaignEnrollments
      ])

      notify({
        status: 'success',
        message: 'The user was enrolled successfully'
      })
    } catch (_) {
      notify({
        status: 'error',
        message: 'Something went wrong while deleting the enrollment'
      })
    }
  }

  return addSuperCampaignEnrollment
}
