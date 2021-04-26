import { Grid } from '@material-ui/core'

import ShowingDetailTabBookingsFilterCard, {
  BookingFilterType
} from './ShowingDetailTabBookingsFilterCard'
import { AppointmentFilter } from './types'
import { appointmentStatusInfo } from './use-appointment-filter-info'
import useCountAppointmentTypes from './use-count-appointment-types'

interface ShowingDetailTabBookingsFilterListProps {
  value: AppointmentFilter
  onChange: (value: AppointmentFilter) => void
  appointments: IShowingAppointment[]
}

function ShowingDetailTabBookingsFilterList({
  value,
  onChange,
  appointments
}: ShowingDetailTabBookingsFilterListProps) {
  const counters = useCountAppointmentTypes(appointments)

  const filters: BookingFilterType[] = [
    {
      type: 'All',
      ...appointmentStatusInfo.All,
      count: counters.All,
      badge: 0
    },
    {
      type: 'Requested',
      ...appointmentStatusInfo.Requested,
      count: counters.Requested,
      badge: 0
    },
    {
      type: 'Confirmed',
      ...appointmentStatusInfo.Confirmed,
      count: counters.Confirmed,
      badge: 0
    },
    {
      type: 'Rescheduled',
      ...appointmentStatusInfo.Rescheduled,
      count: counters.Rescheduled,
      badge: 0
    },
    {
      type: 'Canceled',
      ...appointmentStatusInfo.Canceled,
      count: counters.Canceled,
      badge: 0
    },
    {
      type: 'Feedback',
      ...appointmentStatusInfo.Feedback,
      count: counters.Feedback,
      badge: 0
    }
  ]

  return (
    <Grid container>
      <Grid item xs={12} lg={9}>
        <Grid container spacing={2}>
          {filters.map(filter => (
            <Grid key={filter.type} item xs={6} sm={4} md={2}>
              <ShowingDetailTabBookingsFilterCard
                {...filter}
                selected={filter.type === value}
                onClick={() => onChange(filter.type)}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ShowingDetailTabBookingsFilterList
