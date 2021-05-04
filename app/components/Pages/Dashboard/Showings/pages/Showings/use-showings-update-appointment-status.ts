import { Dispatch, SetStateAction } from 'react'

import { ApprovalActionParams } from '../../types'
import { updateShowingsAppointmentState } from './helpers'

type UseShowingsUpdateAppointmentStatusReturn = (
  params: ApprovalActionParams
) => void

function useShowingsUpdateAppointmentStatus(
  setShowings: Dispatch<SetStateAction<IShowing[]>>
): UseShowingsUpdateAppointmentStatusReturn {
  return ({ appointmentId, status, showingId }: ApprovalActionParams) => {
    updateShowingsAppointmentState(
      setShowings,
      showingId,
      appointmentId,
      appointment => ({ ...appointment, status })
    )
  }
}

export default useShowingsUpdateAppointmentStatus
