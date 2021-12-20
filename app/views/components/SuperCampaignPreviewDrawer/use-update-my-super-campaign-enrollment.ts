import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import updateMySuperCampaignEnrollmentModel from '@app/models/super-campaign/update-my-super-campaign-enrollment'

type UseUpdateMySuperCampaignEnrollment = {
  isUpdating: boolean
  updateMySuperCampaignEnrollment: (tags: string[]) => Promise<void>
}

export function useUpdateMySuperCampaignEnrollment(
  superCampaignId: UUID,
  onUpdated: (enrollment: ISuperCampaignEnrollment) => void
): UseUpdateMySuperCampaignEnrollment {
  const { isRunning, runActionThenNotify } = useRunActionThenNotify()

  const updateMySuperCampaignEnrollment = (tags: string[]) =>
    runActionThenNotify(
      async () => {
        const enrollment = await updateMySuperCampaignEnrollmentModel(
          superCampaignId,
          tags
        )

        onUpdated(enrollment)
      },
      'You have been participated in the campaign',
      'Something went wrong while updating the enrollment'
    )

  return { isUpdating: isRunning, updateMySuperCampaignEnrollment }
}
