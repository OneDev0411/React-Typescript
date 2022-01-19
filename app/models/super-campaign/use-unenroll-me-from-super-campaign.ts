import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import { unenrollMeFromSuperCampaign as unenrollMeFromSuperCampaignModel } from '@app/models/super-campaign'

type UseUnenrollMeFromSuperCampaign = {
  isDeleting: boolean
  unenrollMeFromSuperCampaign: () => Promise<void>
}

export function useUnenrollMeFromSuperCampaign(
  superCampaignId: UUID,
  onUnenroll: () => void
): UseUnenrollMeFromSuperCampaign {
  const { isRunning, runActionThenNotify } = useRunActionThenNotify()

  const unenrollMeFromSuperCampaign = () =>
    runActionThenNotify(
      async () => {
        await unenrollMeFromSuperCampaignModel(superCampaignId)

        onUnenroll()
      },
      'You have been opted-out from the campaign',
      'Something went wrong while opting-out the campaign'
    )

  return { isDeleting: isRunning, unenrollMeFromSuperCampaign }
}
