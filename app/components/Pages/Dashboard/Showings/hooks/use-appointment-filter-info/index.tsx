import {
  mdiAlertOctagramOutline,
  mdiCheckCircleOutline,
  mdiRotateRight,
  mdiCloseCircleOutline,
  mdiStarOutline,
  mdiFlagCheckered,
  mdiExclamation,
  mdiCheck,
  mdiClose,
  mdiPlus
} from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
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
    filterIcon: <SvgIcon path={mdiExclamation} size={muiIconSizes.small} />,
    filter: createStatusFilter('Requested')
  },
  Confirmed: {
    label: 'Approved',
    icon: <SvgIcon path={mdiCheckCircleOutline} />,
    filterIcon: <SvgIcon path={mdiCheck} size={muiIconSizes.small} />,
    filter: createStatusFilter('Confirmed')
  },
  Rescheduled: {
    label: 'Rescheduled',
    icon: <SvgIcon path={mdiRotateRight} />,
    filterIcon: <SvgIcon path={mdiRotateRight} size={muiIconSizes.small} />,
    filter: createStatusFilter('Rescheduled')
  },
  Canceled: {
    label: 'Canceled',
    icon: <SvgIcon path={mdiCloseCircleOutline} />,
    filterIcon: <SvgIcon path={mdiClose} size={muiIconSizes.small} />,
    filter: createStatusFilter('Canceled')
  },
  Completed: {
    label: 'Finished',
    icon: <SvgIcon path={mdiFlagCheckered} />,
    filterIcon: <SvgIcon path={mdiFlagCheckered} size={muiIconSizes.small} />,
    filter: createStatusFilter('Completed')
  },
  Feedback: {
    label: 'Feedback',
    icon: <SvgIcon path={mdiStarOutline} />,
    filterIcon: <SvgIcon path={mdiPlus} size={muiIconSizes.small} />,
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
