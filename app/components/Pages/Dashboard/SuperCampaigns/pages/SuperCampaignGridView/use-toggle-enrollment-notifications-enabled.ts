import { useRunActionThenNotify } from '@app/hooks/use-run-action-then-notify'
import setSuperCampaignEnrollmentNotificationsEnabled from '@app/models/super-campaign/set-super-campaign-enrollment-notifications-enabled'

export function useToggleEnrollmentNotificationsEnabled(
  superCampaign: ISuperCampaignWithEnrollment,
  onToggle: (enabled: boolean) => void
) {
  const { isRunning, runActionThenNotify } = useRunActionThenNotify()

  const toggleEnrollmentNotificationsEnabled = async () => {
    const nextStatus = !superCampaign.enrollment?.notifications_enabled

    runActionThenNotify(
      async () => {
        await setSuperCampaignEnrollmentNotificationsEnabled(
          superCampaign.id,
          nextStatus
        )
        onToggle(nextStatus)
      },
      'The enrollment notifications status has been updated',
      'Something went wrong while updating the notifications status'
    )
  }

  return {
    isToggling: isRunning,
    toggleEnrollmentNotificationsEnabled
  }
}
