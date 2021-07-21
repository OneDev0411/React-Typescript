import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  useTheme
} from '@material-ui/core'
import { mdiDotsHorizontal } from '@mdi/js'
import cn from 'classnames'

import useIsMobile from '@app/hooks/use-is-mobile'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getFormattedAppointmentDateTime } from '../utils'

import { useShowingAppointmentStatusDetailsStyles } from './hooks'
import StepConnector from './StepConnector'

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
}

export default function ShowingAppointmentRescheduled({ appointment }: Props) {
  const classes = useShowingAppointmentStatusDetailsStyles()
  const theme = useTheme()
  const isMobile = useIsMobile()

  return (
    <Stepper
      orientation="vertical"
      className={classes.stepper}
      connector={isMobile ? <Box py={2} px={1} /> : <StepConnector />}
      activeStep={1}
    >
      <Step>
        <StepLabel
          className={classes.stepLabel}
          StepIconComponent={() => (
            <div className={cn(classes.stepIconContainer)}>
              <SvgIcon
                color={theme.palette.primary.main}
                path={mdiDotsHorizontal}
              />
            </div>
          )}
        >
          <Typography variant="h6">
            Appointment Reschedule Requested!
          </Typography>

          <Typography variant="body1" color="textSecondary">
            You've requested to reschedule your appointment for{' '}
            <span style={{ color: theme.palette.text.primary }}>
              {getFormattedAppointmentDateTime(appointment)}
            </span>
          </Typography>
        </StepLabel>
      </Step>

      <Step>
        <StepLabel
          className={classes.stepLabel}
          StepIconComponent={() => (
            <div className={classes.stepIconContainer}>
              <SvgIcon
                color={theme.palette.primary.main}
                path={mdiDotsHorizontal}
              />
            </div>
          )}
        >
          <Typography variant="h6">Pending Agent Approval</Typography>

          <Typography variant="body1" color="textSecondary">
            Your reschedule request was sent to the agent, once he approves it,
            we will email and text you your confirmation. <br />
            {appointment.buyer_message && (
              <>
                <strong>Reschedule Message: </strong>
                {appointment.buyer_message}
              </>
            )}
          </Typography>
        </StepLabel>
      </Step>
    </Stepper>
  )
}
