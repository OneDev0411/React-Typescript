import { Grid } from '@material-ui/core'

import ShowingDetailTabBookingsFilterCard from './ShowingDetailTabBookingsFilterCard'
import { AppointmentFilter } from './types'
import useAppointmentFilters from './use-appointment-filters'

interface ShowingDetailTabBookingsFilterListProps {
  value: AppointmentFilter
  onChange: (value: AppointmentFilter) => void
  appointments: IShowingAppointment[]
  notifications: IShowingAppointment[]
}

const filterTypes: AppointmentFilter[] = [
  'All',
  'Requested',
  'Confirmed',
  'Rescheduled',
  'Canceled',
  'Feedback'
]

function ShowingDetailTabBookingsFilterList({
  value,
  onChange,
  appointments,
  notifications
}: ShowingDetailTabBookingsFilterListProps) {
  const filters = useAppointmentFilters(
    filterTypes,
    appointments,
    notifications
  )

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
