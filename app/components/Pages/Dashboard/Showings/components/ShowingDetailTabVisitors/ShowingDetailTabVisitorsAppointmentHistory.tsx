import { useState } from 'react'

import {
  Popper,
  Paper,
  PopperProps,
  makeStyles,
  Typography,
  Box
} from '@material-ui/core'

import {
  getAppointmentTimeLabel,
  getAppointmentDateLabel,
  getAppointmentTitle
} from '../../helpers'
import ShowingViewFeedbackButton from '../ShowingViewFeedbackButton'

const useStyles = makeStyles(
  theme => ({
    root: { width: theme.spacing(50) },
    date: { width: theme.spacing(13) },
    popper: {
      zIndex: 1,
      '&[x-placement*="bottom"] $arrow': {
        top: 0,
        left: 0,
        marginTop: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '0 1em 1em 1em',
          // eslint-disable-next-line max-len
          borderColor: `transparent transparent ${theme.palette.background.paper} transparent`
        }
      },
      '&[x-placement*="top"] $arrow': {
        bottom: 0,
        left: 0,
        marginBottom: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '1em 1em 0 1em',
          // eslint-disable-next-line max-len
          borderColor: `${theme.palette.background.paper} transparent transparent transparent`
        }
      },
      '&[x-placement*="right"] $arrow': {
        left: 0,
        marginLeft: '-0.9em',
        height: '3em',
        width: '1em',
        '&::before': {
          borderWidth: '1em 1em 1em 0',
          // eslint-disable-next-line max-len
          borderColor: `transparent ${theme.palette.background.paper} transparent transparent`
        }
      },
      '&[x-placement*="left"] $arrow': {
        right: 0,
        marginRight: '-0.9em',
        height: '3em',
        width: '1em',
        '&::before': {
          borderWidth: '1em 0 1em 1em',
          // eslint-disable-next-line max-len
          borderColor: `transparent transparent transparent ${theme.palette.background.paper}`
        }
      }
    },
    arrow: {
      position: 'absolute',
      fontSize: 7,
      width: '3em',
      height: '3em',
      '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        borderStyle: 'solid'
      }
    }
  }),
  { name: 'ShowingDetailTabVisitorsAppointmentHistory' }
)

export interface ShowingDetailTabVisitorsAppointmentHistoryProps
  extends Omit<PopperProps, 'children'> {
  duration: IShowing['duration']
  appointments: IShowingAppointment<'showing'>[]
}

function ShowingDetailTabVisitorsAppointmentHistory({
  duration,
  appointments,
  ...otherProps
}: ShowingDetailTabVisitorsAppointmentHistoryProps) {
  const classes = useStyles()
  const [arrowRef, setArrowRef] = useState<Nullable<HTMLSpanElement>>(null)

  return (
    <Popper
      {...otherProps}
      className={classes.popper}
      modifiers={{
        arrow: {
          enabled: true,
          element: arrowRef
        }
      }}
    >
      <span className={classes.arrow} ref={setArrowRef} />
      <Paper className={classes.root}>
        <Box px={2} py={1}>
          {appointments.map(appointment => (
            <Box
              key={appointment.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              height="40px"
            >
              <Typography variant="body2" component="div">
                <Box display="inline-block" className={classes.date}>
                  {getAppointmentDateLabel(appointment.time)}
                </Box>
                {getAppointmentTimeLabel(appointment.time, duration)}
              </Typography>

              {appointment.feedback && (
                <ShowingViewFeedbackButton
                  feedback={appointment.feedback}
                  contact={appointment.contact}
                  appointmentTitle={getAppointmentTitle(appointment)}
                />
              )}
            </Box>
          ))}
        </Box>
      </Paper>
    </Popper>
  )
}

export default ShowingDetailTabVisitorsAppointmentHistory
