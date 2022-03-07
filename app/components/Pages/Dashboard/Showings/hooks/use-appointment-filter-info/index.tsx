import {
  mdiRotateRight,
  mdiFlagCheckered,
  mdiAlertDecagramOutline,
  mdiCheckCircleOutline,
  mdiCloseCircleOutline,
  mdiStarOutline
} from '@mdi/js'

import { AppointmentFilter, AppointmentFilterInfo } from '../../types'

const createStatusFilter =
  (status: IShowingAppointmentStatus) =>
  (appointments: IShowingAppointment<'showing'>[]) =>
    appointments.filter(appointment => appointment.status === status)

export const appointmentStatusInfo: Record<
  AppointmentFilter,
  AppointmentFilterInfo
> = {
  All: {
    label: 'All Bookings'
  },
  Requested: {
    label: 'Requested',
    icon: mdiAlertDecagramOutline,
    filter: createStatusFilter('Requested')
  },
  Confirmed: {
    label: 'Approved',
    icon: mdiCheckCircleOutline,
    filter: createStatusFilter('Confirmed')
  },
  Rescheduled: {
    label: 'Rescheduled',
    icon: mdiRotateRight,
    filter: createStatusFilter('Rescheduled')
  },
  Canceled: {
    label: 'Canceled',
    icon: mdiCloseCircleOutline,
    filter: createStatusFilter('Canceled')
  },
  Completed: {
    label: 'Finished',
    icon: mdiFlagCheckered,
    filter: createStatusFilter('Completed')
  },
  Feedback: {
    label: 'Feedback',
    icon: mdiStarOutline,
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
