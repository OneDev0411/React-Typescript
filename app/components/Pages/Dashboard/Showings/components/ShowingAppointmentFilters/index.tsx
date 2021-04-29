import { Grid } from '@material-ui/core'

import { AppointmentFilter } from '../../types'
import useAppointmentFilters from './use-appointment-filters'
import ShowingAppointmentFilterCard from './ShowingAppointmentFilterCard'

interface ShowingAppointmentFiltersProps {
  value?: AppointmentFilter
  onChange?: (value: AppointmentFilter) => void
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

function ShowingAppointmentFilters({
  value,
  onChange,
  appointments,
  notifications
}: ShowingAppointmentFiltersProps) {
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
              <ShowingAppointmentFilterCard
                {...filter}
                selected={filter.type === value}
                onClick={() => onChange?.(filter.type)}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ShowingAppointmentFilters
