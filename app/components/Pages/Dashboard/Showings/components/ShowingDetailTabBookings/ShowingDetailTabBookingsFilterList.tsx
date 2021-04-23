import { Grid } from '@material-ui/core'

import ShowingDetailTabBookingsFilterCard, {
  BookingFilterType
} from './ShowingDetailTabBookingsFilterCard'
import { appointmentStatusIconLabel } from './use-appointment-status-icon-label'
import useCountAppointmentTypes from './use-count-appointment-types'

interface ShowingDetailTabBookingsFilterListProps {
  value: IAppointmentStatus
  onChange: (value: IAppointmentStatus) => void
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
      type: 'Requested',
      ...appointmentStatusIconLabel.Requested,
      count: counters.Requested,
      badge: 10
    },
    {
      type: 'Confirmed',
      ...appointmentStatusIconLabel.Confirmed,
      count: counters.Confirmed,
      badge: 0
    },
    {
      type: 'Rescheduled',
      ...appointmentStatusIconLabel.Rescheduled,
      count: counters.Rescheduled,
      badge: 0
    },
    {
      type: 'Canceled',
      ...appointmentStatusIconLabel.Canceled,
      count: counters.Canceled,
      badge: 0
    },
    {
      type: 'Completed',
      ...appointmentStatusIconLabel.Completed,
      count: counters.Completed,
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
