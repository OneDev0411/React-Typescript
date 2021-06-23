import {
  NewReleasesOutlined as NewReleasesOutlinedIcon,
  CheckCircleOutlineOutlined as CheckCircleOutlineOutlinedIcon,
  RotateRightOutlined as RotateRightOutlinedIcon,
  HighlightOffOutlined as HighlightOffOutlinedIcon,
  StarBorderOutlined as StarBorderOutlinedIcon,
  FlagOutlined as FlagFlagOutlinedIcon
} from '@material-ui/icons'

import { AppointmentFilter, AppointmentFilterInfo } from '../../types'

const createStatusFilter = (status: IShowingAppointmentStatus) => (
  appointments: IShowingAppointment[]
) => appointments.filter(appointment => appointment.status === status)

export const appointmentStatusInfo: Record<
  AppointmentFilter,
  AppointmentFilterInfo
> = {
  All: {
    label: 'All Bookings'
  },
  Requested: {
    label: 'Requested',
    icon: <NewReleasesOutlinedIcon />,
    filter: createStatusFilter('Requested')
  },
  Confirmed: {
    label: 'Approved',
    icon: <CheckCircleOutlineOutlinedIcon />,
    filter: createStatusFilter('Confirmed')
  },
  Rescheduled: {
    label: 'Rescheduled',
    icon: <RotateRightOutlinedIcon />,
    filter: createStatusFilter('Rescheduled')
  },
  Canceled: {
    label: 'Canceled',
    icon: <HighlightOffOutlinedIcon />,
    filter: createStatusFilter('Canceled')
  },
  Completed: {
    label: 'Finished',
    icon: <FlagFlagOutlinedIcon />,
    filter: createStatusFilter('Completed')
  },
  Feedback: {
    label: 'Feedback',
    icon: <StarBorderOutlinedIcon />,
    filter: appointments =>
      appointments.filter(appointment => !!appointment.feedback)
  }
}

function useAppointmentFilterInfo(
  filter: AppointmentFilter
): AppointmentFilterInfo {
  return appointmentStatusInfo[filter]
}

export default useAppointmentFilterInfo
