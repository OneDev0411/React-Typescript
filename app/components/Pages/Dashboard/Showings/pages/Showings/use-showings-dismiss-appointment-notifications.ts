import { Dispatch, SetStateAction } from 'react'

import { DismissActionParams } from '../../types'
import { updateShowingsAppointmentState } from './helpers'

type UseShowingsDismissAppointmentNotifications = (
  params: DismissActionParams
) => void

function useShowingsDismissAppointmentNotifications(
  setShowings: Dispatch<SetStateAction<IShowing[]>>
): UseShowingsDismissAppointmentNotifications {
  return ({ appointmentId, showingId }: DismissActionParams) => {
    updateShowingsAppointmentState(
      setShowings,
      showingId,
      appointmentId,
      appointment => ({ ...appointment, notifications: null })
    )
  }
}

export default useShowingsDismissAppointmentNotifications
