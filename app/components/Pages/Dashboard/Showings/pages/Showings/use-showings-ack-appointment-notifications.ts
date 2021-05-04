import { Dispatch, SetStateAction } from 'react'

import { ackNotification } from 'models/notifications'

import { ApprovalActionParams } from '../../types'
import { updateShowingsAppointmentState } from './helpers'

type UseShowingsAckAppointmentNotifications = (
  params: ApprovalActionParams
) => void

function useShowingsAckAppointmentNotifications(
  setShowings: Dispatch<SetStateAction<IShowing[]>>
): UseShowingsAckAppointmentNotifications {
  return async ({
    appointmentId,
    showingId,
    notifications
  }: ApprovalActionParams) => {
    // mark all notifications as seen
    const promises =
      notifications?.map(notification => ackNotification(notification.id)) || []

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

export default useShowingsAckAppointmentNotifications
