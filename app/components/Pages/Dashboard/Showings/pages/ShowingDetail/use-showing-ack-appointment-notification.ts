import { Dispatch, SetStateAction } from 'react'

import { useDispatch } from 'react-redux'

import { decreaseShowingTotalNotificationCount } from 'actions/showings'

import { AckActionParams } from '../../types'

import { updateAppointmentState } from './helpers'

type UseShowingAckAppointmentNotification = (params: AckActionParams) => void

function useShowingAckAppointmentNotification(
  setShowing: Dispatch<SetStateAction<IShowing<'showing'>>>
): UseShowingAckAppointmentNotification {
  const dispatch = useDispatch()

  return ({ appointmentId, notificationId }: AckActionParams) => {
    updateAppointmentState(setShowing, appointmentId, appointment => ({
      ...appointment,
      notifications:
        appointment.notifications?.filter(
          notification => notification.id !== notificationId
        ) ?? null
    }))
    dispatch(decreaseShowingTotalNotificationCount(1))
  }
}

export default useShowingAckAppointmentNotification
