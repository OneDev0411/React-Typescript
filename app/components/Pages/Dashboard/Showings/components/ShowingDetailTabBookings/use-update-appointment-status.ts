import { Dispatch, SetStateAction } from 'react'

import { ApprovalActionParams } from '../../types'

import { updateAppointmentState } from './helpers'

type UseUpdateAppointmentStatusReturn = (params: ApprovalActionParams) => void

function useUpdateAppointmentStatus(
  setShowing: Dispatch<SetStateAction<IShowing>>
): UseUpdateAppointmentStatusReturn {
  return ({ appointmentId, status }: ApprovalActionParams) => {
    updateAppointmentState(setShowing, appointmentId, appointment => ({
      ...appointment,
      status
    }))
  }
}

export default useUpdateAppointmentStatus
