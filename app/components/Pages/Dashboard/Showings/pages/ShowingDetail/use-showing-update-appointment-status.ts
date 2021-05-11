import { Dispatch, SetStateAction } from 'react'

import { ApprovalActionParams } from '../../types'

import { updateAppointmentState } from './helpers'

type UseShowingUpdateAppointmentStatusReturn = (
  params: ApprovalActionParams
) => void

function useUpdateAppointmentStatus(
  setShowing: Dispatch<SetStateAction<IShowing>>
): UseShowingUpdateAppointmentStatusReturn {
  return ({ appointmentId, status }: ApprovalActionParams) => {
    updateAppointmentState(setShowing, appointmentId, appointment => ({
      ...appointment,
      status
    }))
  }
}

export default useUpdateAppointmentStatus
