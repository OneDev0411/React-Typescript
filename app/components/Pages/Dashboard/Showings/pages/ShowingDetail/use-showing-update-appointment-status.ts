import { Dispatch, SetStateAction } from 'react'

import { ApprovalActionParams } from '../../types'

import { updateAppointmentState } from './helpers'

type UseShowingUpdateAppointmentStatusReturn = (
  params: ApprovalActionParams
) => void

function useUpdateAppointmentStatus(
  setShowing: Dispatch<SetStateAction<IShowing<'showing'>>>
): UseShowingUpdateAppointmentStatusReturn {
  return ({ appointmentId, appointment }: ApprovalActionParams) => {
    updateAppointmentState(setShowing, appointmentId, oldAppointment => ({
      ...oldAppointment,
      ...appointment,
      showing: oldAppointment.showing
    }))
  }
}

export default useUpdateAppointmentStatus
