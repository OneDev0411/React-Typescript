import { Grid } from '@material-ui/core'

import { AppointmentFilter } from '../../types'

import ShowingAppointmentFilterCard from './ShowingAppointmentFilterCard'
import useAppointmentFilters from './use-appointment-filters'

export interface ShowingAppointmentFiltersProps {
  value?: AppointmentFilter
  onChange?: (value: AppointmentFilter) => void
  appointments: IShowingAppointment<'showing'>[]
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
  generateLink
}: ShowingAppointmentFiltersProps) {
  const filters = useAppointmentFilters(filterTypes, appointments)

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
