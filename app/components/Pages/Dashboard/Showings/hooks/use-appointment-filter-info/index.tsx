import {
  mdiAlertOctagramOutline,
  mdiCheckCircleOutline,
  mdiRotateRight,
  mdiCloseCircleOutline,
  mdiStarOutline,
  mdiFlagCheckered
} from '@mdi/js'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

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
    icon: <SvgIcon path={mdiAlertOctagramOutline} />,
    filter: createStatusFilter('Requested')
  },
  Confirmed: {
    label: 'Approved',
    icon: <SvgIcon path={mdiCheckCircleOutline} />,
    filter: createStatusFilter('Confirmed')
  },
  Rescheduled: {
    label: 'Rescheduled',
    icon: <SvgIcon path={mdiRotateRight} />,
    filter: createStatusFilter('Rescheduled')
  },
  Canceled: {
    label: 'Canceled',
    icon: <SvgIcon path={mdiCloseCircleOutline} />,
    filter: createStatusFilter('Canceled')
  },
  Completed: {
    label: 'Finished',
    icon: <SvgIcon path={mdiFlagCheckered} />,
    filter: createStatusFilter('Completed')
  },
  Feedback: {
    label: 'Feedback',
    icon: <SvgIcon path={mdiStarOutline} />,
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
