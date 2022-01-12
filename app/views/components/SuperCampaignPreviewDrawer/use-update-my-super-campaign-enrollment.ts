import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import { updateMySuperCampaignEnrollment as updateMySuperCampaignEnrollmentModel } from '@app/models/super-campaign'

type UseUpdateMySuperCampaignEnrollment = {
  isUpdating: boolean
  updateMySuperCampaignEnrollment: (tags: string[]) => Promise<void>
}

export function useUpdateMySuperCampaignEnrollment(
  superCampaignId: UUID,
  hasUnenroll: boolean,
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
      hasUnenroll
        ? 'Your enrollment has been updated'
        : 'You have been participated in the campaign',
      'Something went wrong while updating the enrollment'
    )

  return { isUpdating: isRunning, updateMySuperCampaignEnrollment }
}
