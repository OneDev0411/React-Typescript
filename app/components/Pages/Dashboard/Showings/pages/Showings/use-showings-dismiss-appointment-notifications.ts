import { Dispatch, SetStateAction } from 'react'
import { useDispatch } from 'react-redux'

import { decreaseShowingTotalNotificationCount } from 'actions/showings'

import { DismissActionParams } from '../../types'
import { updateShowingsAppointmentState } from './helpers'

type UseShowingsDismissAppointmentNotifications = (
  params: DismissActionParams
) => void

function useShowingsDismissAppointmentNotifications(
  setShowings: Dispatch<SetStateAction<IShowing<'showing'>[]>>
): UseShowingsDismissAppointmentNotifications {
  const dispatch = useDispatch()

  return ({
    appointmentId,
    showingId,
    notificationCount
  }: DismissActionParams) => {
    updateShowingsAppointmentState(
      setShowings,
      showingId,
      appointmentId,
      appointment => ({ ...appointment, notifications: null })
    )
    dispatch(decreaseShowingTotalNotificationCount(notificationCount))
  }
}

export default useShowingsDismissAppointmentNotifications
