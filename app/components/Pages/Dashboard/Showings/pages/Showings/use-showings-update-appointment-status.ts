import { Dispatch, SetStateAction } from 'react'

import { ApprovalActionParams } from '../../types'
import { updateShowingsAppointmentState } from './helpers'

type UseShowingsUpdateAppointmentStatusReturn = (
  params: ApprovalActionParams
) => void

function useShowingsUpdateAppointmentStatus(
  setShowings: Dispatch<SetStateAction<IShowing[]>>
): UseShowingsUpdateAppointmentStatusReturn {
  return ({ appointmentId, appointment, showingId }: ApprovalActionParams) => {
    updateShowingsAppointmentState(
      setShowings,
      showingId,
      appointmentId,
      () => appointment
    )
  }
}

export default useShowingsUpdateAppointmentStatus
