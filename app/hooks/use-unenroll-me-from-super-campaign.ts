import useNotify from '@app/hooks/use-notify'
import useSafeState from '@app/hooks/use-safe-state'
import unenrollMeFromSuperCampaignModel from '@app/models/super-campaign/unenroll-me-from-super-campaign'

type UseUnenrollMeFromSuperCampaign = {
  isDeleting: boolean
  unenrollMeFromSuperCampaign: () => Promise<void>
}

export function useUnenrollMeFromSuperCampaign(
  superCampaignId: UUID,
  onUnenroll: () => void
): UseUnenrollMeFromSuperCampaign {
  const notify = useNotify()
  const [isDeleting, setIsDeleting] = useSafeState(false)

  const unenrollMeFromSuperCampaign = async () => {
    setIsDeleting(true)

    try {
      await unenrollMeFromSuperCampaignModel(superCampaignId)

      onUnenroll()
    } catch (_) {
      notify({
        status: 'error',
        message: 'Something went wrong while unenrolling the super campaign'
      })
    }

    setIsDeleting(false)
  }

  return { isDeleting, unenrollMeFromSuperCampaign }
}
