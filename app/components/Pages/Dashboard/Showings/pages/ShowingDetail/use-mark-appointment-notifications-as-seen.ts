import { Dispatch, SetStateAction } from 'react'

import { markNotificationAsSeen } from 'models/notifications'

import { ApprovalActionParams } from '../../types'

import { updateAppointmentState } from './helpers'

type UseMarkAppointmentNotificationsAsSeen = (
  params: ApprovalActionParams
) => void

function useMarkAppointmentNotificationsAsSeen(
  setShowing: Dispatch<SetStateAction<IShowing>>
): UseMarkAppointmentNotificationsAsSeen {
  return async ({ appointmentId, notifications }: ApprovalActionParams) => {
    // mark all notifications as seen
    const promises =
      notifications?.map(notification =>
        markNotificationAsSeen(notification.id)
      ) || []

    await Promise.all(promises)

    // update the appointment state
    updateAppointmentState(setShowing, appointmentId, appointment => ({
      ...appointment,
      notifications: null
    }))
  }
}

export default useMarkAppointmentNotificationsAsSeen
