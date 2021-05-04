import { Dispatch, SetStateAction } from 'react'

import { markNotificationAsSeen } from 'models/notifications'

import { ApprovalActionParams } from '../../types'
import { updateShowingsAppointmentState } from './helpers'

type UseShowingsMarkAppointmentNotificationsAsSeen = (
  params: ApprovalActionParams
) => void

function useShowingsMarkAppointmentNotificationsAsSeen(
  setShowings: Dispatch<SetStateAction<IShowing[]>>
): UseShowingsMarkAppointmentNotificationsAsSeen {
  return async ({
    appointmentId,
    showingId,
    notifications
  }: ApprovalActionParams) => {
    // mark all notifications as seen
    const promises =
      notifications?.map(notification =>
        markNotificationAsSeen(notification.id)
      ) || []

    await Promise.all(promises)

    // update the appointment state
    updateShowingsAppointmentState(
      setShowings,
      showingId,
      appointmentId,
      appointment => ({ ...appointment, notifications: null })
    )
  }
}

export default useShowingsMarkAppointmentNotificationsAsSeen
