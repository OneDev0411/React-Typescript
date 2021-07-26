import { useState, MouseEvent } from 'react'

import { Typography, makeStyles } from '@material-ui/core'
import { useDebouncedCallback } from 'use-debounce/lib'

import ShowingDetailTabVisitorsAppointmentHistory, {
  ShowingDetailTabVisitorsAppointmentHistoryProps
} from './ShowingDetailTabVisitorsAppointmentHistory'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      height: theme.spacing(4),
      cursor: 'default',
      transition: theme.transitions.create('color')
    }
  }),
  { name: 'ShowingDetailTabVisitorsColumnTotalVisit' }
)

interface ShowingDetailTabVisitorsColumnTotalVisitProps
  extends Pick<ShowingDetailTabVisitorsAppointmentHistoryProps, 'duration'> {
  appointments: Optional<IShowingAppointment<'showing'>[]>
}

function ShowingDetailTabVisitorsColumnTotalVisit({
  duration,
  appointments
}: ShowingDetailTabVisitorsColumnTotalVisitProps) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  let [openHistoryPopper, cancel] = useDebouncedCallback(
    (currentTarget: HTMLDivElement) => {
      if (!anchorEl) {
        setAnchorEl(currentTarget)
      }
    },
    500
  )

  const closeHistoryPopper = () => {
    setAnchorEl(null)
    cancel()
  }

  const count = appointments?.length ?? 0

  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
  }

  return (
    <Typography
      variant="body2"
      component="div"
      className={classes.root}
      onMouseEnter={event => openHistoryPopper(event.currentTarget)}
      onMouseLeave={closeHistoryPopper}
      onClick={handleClick}
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
