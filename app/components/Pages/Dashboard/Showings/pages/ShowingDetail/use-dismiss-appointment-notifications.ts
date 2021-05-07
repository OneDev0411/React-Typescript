import { Dispatch, SetStateAction } from 'react'

import { DismissActionParams } from '../../types'

import { updateAppointmentState } from './helpers'

type UseDismissAppointmentNotifications = (params: DismissActionParams) => void

function useDismissAppointmentNotifications(
  setShowing: Dispatch<SetStateAction<IShowing>>
): UseDismissAppointmentNotifications {
  return async ({ appointmentId }: DismissActionParams) => {
    updateAppointmentState(setShowing, appointmentId, appointment => ({
      ...appointment,
      notifications: null
    }))
  }
}

export default useDismissAppointmentNotifications
