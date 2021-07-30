import { Dispatch, SetStateAction } from 'react'

import { useDispatch } from 'react-redux'

import { decreaseShowingTotalNotificationCount } from 'actions/showings'

import { AckActionParams } from '../../types'

import { updateShowingsAppointmentState } from './helpers'

type UseShowingsAckAppointmentNotification = (params: AckActionParams) => void

function useShowingsAckAppointmentNotification(
  setShowings: Dispatch<SetStateAction<IShowing<'showing'>[]>>
): UseShowingsAckAppointmentNotification {
  const dispatch = useDispatch()

  return ({ appointmentId, showingId, notificationId }: AckActionParams) => {
    updateShowingsAppointmentState(
      setShowings,
      showingId,
      appointmentId,
      appointment => ({
        ...appointment,
        notifications:
          appointment.notifications?.filter(
            notification => notification.id !== notificationId
          ) ?? null
      })
    )
    dispatch(decreaseShowingTotalNotificationCount(1))
  }
}

export default useShowingsAckAppointmentNotification
