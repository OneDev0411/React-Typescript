import { Grid } from '@material-ui/core'
import {
  NewReleasesOutlined as NewReleasesOutlinedIcon,
  CheckCircleOutlineOutlined as CheckCircleOutlineOutlinedIcon,
  RotateRightOutlined as RotateRightOutlinedIcon,
  HighlightOffOutlined as HighlightOffOutlinedIcon,
  StarBorderOutlined as StarBorderOutlinedIcon
} from '@material-ui/icons'

import ShowingDetailTabBookingsFilterCard, {
  BookingFilterType
} from './ShowingDetailTabBookingsFilterCard'
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
      label: 'Requested',
      count: counters.Requested,
      badge: 10,
      icon: <NewReleasesOutlinedIcon />
    },
    {
      type: 'Confirmed',
      label: 'Approved',
      count: counters.Confirmed,
      badge: 0,
      icon: <CheckCircleOutlineOutlinedIcon />
    },
    {
      type: 'Rescheduled',
      label: 'Rescheduled',
      count: counters.Rescheduled,
      badge: 0,
      icon: <RotateRightOutlinedIcon />
    },
    {
      type: 'Canceled',
      label: 'Canceled',
      count: counters.Canceled,
      badge: 0,
      icon: <HighlightOffOutlinedIcon />
    },
    {
      type: 'Completed',
      label: 'Feedbacks',
      count: counters.Completed,
      badge: 0,
      icon: <StarBorderOutlinedIcon />
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
