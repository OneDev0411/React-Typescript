import { Grid } from '@material-ui/core'

import { AppointmentFilter } from '../../types'
import useAppointmentFilters from './use-appointment-filters'
import ShowingAppointmentFilterCard from './ShowingAppointmentFilterCard'

export interface ShowingAppointmentFiltersProps {
  value?: AppointmentFilter
  onChange?: (value: AppointmentFilter) => void
  appointments: IShowingAppointment[]
  notifications: IShowingAppointment[]
  generateLink?: (filter: AppointmentFilter) => string
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
  notifications,
  generateLink
}: ShowingAppointmentFiltersProps) {
  const filters = useAppointmentFilters(
    filterTypes,
    appointments,
    notifications
  )

  return (
    <Grid container spacing={2}>
      {filters.map(filter => (
        <Grid key={filter.type} item xs={6} sm={4} md={2}>
          <ShowingAppointmentFilterCard
            {...filter}
            selected={filter.type === value}
            onClick={() => onChange?.(filter.type)}
            link={generateLink?.(filter.type)}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default ShowingAppointmentFilters
