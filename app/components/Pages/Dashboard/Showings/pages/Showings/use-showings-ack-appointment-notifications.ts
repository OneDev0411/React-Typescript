import { Dispatch, SetStateAction } from 'react'

import useNotificationBadgesContext from '../../../SideNav/notificationBadgesContext/useNotificationBadgesContext'
import { AckActionParams } from '../../types'

import { updateShowingsAppointmentState } from './helpers'

type UseShowingsAckAppointmentNotifications = (params: AckActionParams) => void

function useShowingsAckAppointmentNotifications(
  setShowings: Dispatch<SetStateAction<IShowing<'showing'>[]>>
): UseShowingsAckAppointmentNotifications {
  const { decreaseBadgeCounter } = useNotificationBadgesContext()

  return ({ appointmentId, showingId, notificationIds }: AckActionParams) => {
    updateShowingsAppointmentState(
      setShowings,
      showingId,
      appointmentId,
      appointment => ({
        ...appointment,
        notifications:
          appointment.notifications?.filter(
            notification => !notificationIds.includes(notification.id)
          ) ?? null
      })
    )
    decreaseBadgeCounter('showing_notifications')
  }
}

export default useShowingsAckAppointmentNotifications
