import {
  NewReleasesOutlined as NewReleasesOutlinedIcon,
  CheckCircleOutlineOutlined as CheckCircleOutlineOutlinedIcon,
  RotateRightOutlined as RotateRightOutlinedIcon,
  HighlightOffOutlined as HighlightOffOutlinedIcon,
  StarBorderOutlined as StarBorderOutlinedIcon,
  NewReleases as NewReleasesIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Flag as FlagIcon
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
    filledIcon: <NewReleasesIcon />,
    filter: createStatusFilter('Requested')
  },
  Confirmed: {
    label: 'Approved',
    icon: <CheckCircleOutlineOutlinedIcon />,
    filledIcon: <CheckCircleIcon />,
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
    filledIcon: <CancelIcon />,
    filter: createStatusFilter('Canceled')
  },
  Completed: {
    label: 'Completed',
    icon: <span />, // TODO: select an icon for this when needed
    filledIcon: <FlagIcon />,
    filter: createStatusFilter('Completed')
  },
  Feedback: {
    label: 'Feedback',
    icon: <StarBorderOutlinedIcon />,
    filter: appointments => [] // TODO: filter all appointments that has feedback
  }
}

function useAppointmentFilterInfo(
  filter: AppointmentFilter
): AppointmentFilterInfo {
  return appointmentStatusInfo[filter]
}

export default useAppointmentFilterInfo
