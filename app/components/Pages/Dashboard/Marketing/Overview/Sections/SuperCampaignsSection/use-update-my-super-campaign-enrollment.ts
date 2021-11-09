import useNotify from '@app/hooks/use-notify'
import useSafeState from '@app/hooks/use-safe-state'
import updateMySuperCampaignEnrollmentModel from '@app/models/super-campaign/update-my-super-campaign-enrollment'

type UseUpdateMySuperCampaignEnrollment = {
  isUpdating: boolean
  updateMySuperCampaignEnrollment: (tags: string[]) => Promise<void>
}

export function useUpdateMySuperCampaignEnrollment(
  superCampaignId: UUID,
  onUpdated: (enrollment: ISuperCampaignEnrollment) => void
): UseUpdateMySuperCampaignEnrollment {
  const notify = useNotify()
  const [isUpdating, setIsUpdating] = useSafeState(false)

  const updateMySuperCampaignEnrollment = async (tags: string[]) => {
    setIsUpdating(true)

    try {
      const enrollment = await updateMySuperCampaignEnrollmentModel(
        superCampaignId,
        tags
      )

      onUpdated(enrollment)
    } catch (_) {
      notify({
        status: 'error',
        message: 'Something went wrong while updating the enrollment'
      })
    }

    setIsUpdating(false)
  }

  return { isUpdating, updateMySuperCampaignEnrollment }
}
