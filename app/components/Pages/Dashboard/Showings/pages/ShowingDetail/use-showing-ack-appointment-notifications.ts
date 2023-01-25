import { Dispatch, SetStateAction } from 'react'

import { useDispatch } from 'react-redux'

import { decreaseShowingTotalNotificationCount } from 'actions/showings'

import useNotificationBadgesContext from '../../../SideNav/notificationBadgesContext/useNotificationBadgesContext'
import { AckActionParams } from '../../types'

import { updateAppointmentState } from './helpers'

type UseShowingAckAppointmentNotifications = (params: AckActionParams) => void

function useShowingAckAppointmentNotifications(
  setShowing: Dispatch<SetStateAction<IShowing<'showing'>>>
): UseShowingAckAppointmentNotifications {
  const dispatch = useDispatch()
  const { decreaseBadge } = useNotificationBadgesContext()

  return ({ appointmentId, notificationIds }: AckActionParams) => {
    updateAppointmentState(setShowing, appointmentId, appointment => ({
      ...appointment,
      notifications:
        appointment.notifications?.filter(
          notification => !notificationIds.includes(notification.id)
        ) ?? null
    }))
    dispatch(decreaseShowingTotalNotificationCount(notificationIds.length))
    decreaseBadge('showing_notifications')
  }
}

export default useShowingAckAppointmentNotifications
