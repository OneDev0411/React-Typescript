import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  useTheme
} from '@material-ui/core'
import { mdiCheck, mdiDotsHorizontal } from '@mdi/js'
import cn from 'classnames'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import StepConnector from './StepConnector'
import { useShowingAppointmentStatusDetailsStyles } from './hooks'
import { getFormattedAppointmentDateTime } from './utils'

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
}

export default function ShowingAppointmentRequested({ appointment }: Props) {
  const classes = useShowingAppointmentStatusDetailsStyles()
  const theme = useTheme()

  return (
    <Stepper
      orientation="vertical"
      className={classes.stepper}
      connector={<StepConnector />}
      activeStep={1}
    >
      <Step>
        <StepLabel
          className={classes.stepLabel}
          StepIconComponent={() => (
            <div
              className={cn(
                classes.stepIconContainer,
                classes.activeStepIconContainer
              )}
            >
              <SvgIcon color={theme.palette.common.white} path={mdiCheck} />
            </div>
          )}
        >
          <Typography variant="h6">Appointment Requested!</Typography>

          <Typography variant="body1" color="textSecondary">
            You set an appointment for{' '}
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
            Your request was sent to the agent, once he approves it, we will
            email and text you your confirmation.
          </Typography>
        </StepLabel>
      </Step>
    </Stepper>
  )
}
