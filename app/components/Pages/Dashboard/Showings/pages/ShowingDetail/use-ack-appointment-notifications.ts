import { Dispatch, SetStateAction } from 'react'

import { ackNotification } from 'models/notifications'

import { ApprovalActionParams } from '../../types'

import { updateAppointmentState } from './helpers'

type UseAckAppointmentNotifications = (params: ApprovalActionParams) => void

function useAckAppointmentNotifications(
  setShowing: Dispatch<SetStateAction<IShowing>>
): UseAckAppointmentNotifications {
  return async ({ appointmentId, notifications }: ApprovalActionParams) => {
    // mark all notifications as seen
    const promises =
      notifications?.map(notification => ackNotification(notification.id)) || []

    await Promise.all(promises)

    // update the appointment state
    updateAppointmentState(setShowing, appointmentId, appointment => ({
      ...appointment,
      notifications: null
    }))
  }
}

export default useAckAppointmentNotifications
