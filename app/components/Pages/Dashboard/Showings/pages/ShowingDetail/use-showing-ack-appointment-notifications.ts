import { Dispatch, SetStateAction } from 'react'

import { useDispatch } from 'react-redux'

import { decreaseShowingTotalNotificationCount } from 'actions/showings'

import { AckActionParams } from '../../types'

import { updateAppointmentState } from './helpers'

type UseShowingAckAppointmentNotifications = (params: AckActionParams) => void

function useShowingAckAppointmentNotifications(
  setShowing: Dispatch<SetStateAction<IShowing<'showing'>>>
): UseShowingAckAppointmentNotifications {
  const dispatch = useDispatch()

  return ({ appointmentId, notificationIds }: AckActionParams) => {
    updateAppointmentState(setShowing, appointmentId, appointment => ({
      ...appointment,
      notifications:
        appointment.notifications?.filter(
          notification => !notificationIds.includes(notification.id)
        ) ?? null
    }))
    dispatch(decreaseShowingTotalNotificationCount(notificationIds.length))
  }
}

export default useShowingAckAppointmentNotifications
