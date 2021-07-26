import { Dispatch, SetStateAction } from 'react'

import { ApprovalActionParams } from '../../types'

import { updateShowingsAppointmentState } from './helpers'

type UseShowingsUpdateAppointmentStatusReturn = (
  params: ApprovalActionParams
) => void

function useShowingsUpdateAppointmentStatus(
  setShowings: Dispatch<SetStateAction<IShowing<'showing'>[]>>
): UseShowingsUpdateAppointmentStatusReturn {
  return ({ appointmentId, appointment, showingId }: ApprovalActionParams) => {
    updateShowingsAppointmentState(
      setShowings,
      showingId,
      appointmentId,
      oldAppointment => ({
        ...oldAppointment,
        ...appointment,
        showing: oldAppointment.showing
      })
    )
  }
}

export default useShowingsUpdateAppointmentStatus
