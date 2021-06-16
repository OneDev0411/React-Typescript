import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce/lib'
import { Typography } from '@material-ui/core'

import ShowingDetailTabVisitorsAppointmentHistory, {
  ShowingDetailTabVisitorsAppointmentHistoryProps
} from './ShowingDetailTabVisitorsAppointmentHistory'

interface ShowingDetailTabVisitorsColumnTotalVisitProps
  extends Pick<ShowingDetailTabVisitorsAppointmentHistoryProps, 'duration'> {
  appointments: Optional<IShowingAppointment[]>
}

function ShowingDetailTabVisitorsColumnTotalVisit({
  duration,
  appointments
}: ShowingDetailTabVisitorsColumnTotalVisitProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  let [handleMouseEnter, cancel] = useDebouncedCallback(
    (currentTarget: HTMLDivElement) =>
      setAnchorEl(anchorEl ? null : currentTarget),
    500
  )

  const handleMouseLeave = () => {
    setAnchorEl(null)
    cancel()
  }

  const count = appointments?.length ?? 0

  return (
    <Typography
      variant="body2"
      component="span"
      onMouseEnter={event => handleMouseEnter(event.currentTarget)}
      onMouseLeave={handleMouseLeave}
      color={anchorEl ? 'secondary' : 'inherit'}
    >
      {count} Visit{count !== 1 ? 's' : ''} in Total
      {appointments && (
        <ShowingDetailTabVisitorsAppointmentHistory
          open={!!anchorEl}
          anchorEl={anchorEl}
          transition
          placement="bottom"
          duration={duration}
          appointments={appointments}
        />
      )}
    </Typography>
  )
}

export default ShowingDetailTabVisitorsColumnTotalVisit
