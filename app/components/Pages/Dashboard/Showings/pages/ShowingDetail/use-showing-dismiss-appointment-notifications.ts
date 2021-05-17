import { Dispatch, SetStateAction } from 'react'
import { useDispatch } from 'react-redux'

import { decreaseShowingTotalNotificationCount } from 'actions/showings'

import { DismissActionParams } from '../../types'

import { updateAppointmentState } from './helpers'

type UseShowingDismissAppointmentNotifications = (
  params: DismissActionParams
) => void

function useShowingDismissAppointmentNotifications(
  setShowing: Dispatch<SetStateAction<IShowing>>
): UseShowingDismissAppointmentNotifications {
  const dispatch = useDispatch()

  return ({ appointmentId, notificationCount }: DismissActionParams) => {
    updateAppointmentState(setShowing, appointmentId, appointment => ({
      ...appointment,
      notifications: null
    }))
    dispatch(decreaseShowingTotalNotificationCount(notificationCount))
  }
}

export default useShowingDismissAppointmentNotifications
