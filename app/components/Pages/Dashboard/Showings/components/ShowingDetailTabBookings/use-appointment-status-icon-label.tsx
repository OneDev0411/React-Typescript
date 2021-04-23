import { ReactNode } from 'react'
import {
  NewReleasesOutlined as NewReleasesOutlinedIcon,
  CheckCircleOutlineOutlined as CheckCircleOutlineOutlinedIcon,
  RotateRightOutlined as RotateRightOutlinedIcon,
  HighlightOffOutlined as HighlightOffOutlinedIcon,
  StarBorderOutlined as StarBorderOutlinedIcon
} from '@material-ui/icons'

interface AppointmentStatusDetail {
  label: string
  icon: ReactNode
}

export const appointmentStatusIconLabel: Record<
  IAppointmentStatus,
  AppointmentStatusDetail
> = {
  Requested: {
    label: 'Requested',
    icon: <NewReleasesOutlinedIcon />
  },
  Confirmed: {
    label: 'Approved',
    icon: <CheckCircleOutlineOutlinedIcon />
  },
  Rescheduled: {
    label: 'Rescheduled',
    icon: <RotateRightOutlinedIcon />
  },
  Canceled: {
    label: 'Canceled',
    icon: <HighlightOffOutlinedIcon />
  },
  Completed: {
    label: 'Feedback',
    icon: <StarBorderOutlinedIcon />
  }
}

function useAppointmentStatusIconLabel(
  status: IAppointmentStatus
): AppointmentStatusDetail {
  return appointmentStatusIconLabel[status]
}

export default useAppointmentStatusIconLabel
