import useNotify from '@app/hooks/use-notify'
import useSafeState from '@app/hooks/use-safe-state'
import enrollMeInSuperCampaignModel from '@app/models/super-campaign/enroll-me-in-super-campaign'

type UseEnrollMeInSuperCampaign = {
  isEnrolling: boolean
  enrollMeInSuperCampaign: (tags: string[]) => Promise<void>
}

export function useEnrollMeInSuperCampaign(
  superCampaignId: UUID,
  onEnroll: (enrollment: ISuperCampaignEnrollment) => void
): UseEnrollMeInSuperCampaign {
  const notify = useNotify()
  const [isEnrolling, setIsEnrolling] = useSafeState(false)

  const enrollMeInSuperCampaign = async (tags: string[]) => {
    setIsEnrolling(true)

    try {
      const enrollment = await enrollMeInSuperCampaignModel(
        superCampaignId,
        tags
      )

      onEnroll(enrollment)
    } catch (_) {
      notify({
        status: 'error',
        message: 'Something went wrong while enrolling to the campaign'
      })
    }

    setIsEnrolling(false)
  }

  return { isEnrolling, enrollMeInSuperCampaign }
}
