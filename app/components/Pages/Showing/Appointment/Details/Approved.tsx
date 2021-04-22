import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Button,
  useTheme
} from '@material-ui/core'
import { mdiCheck } from '@mdi/js'
import cn from 'classnames'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useShowingAppointmentStatusDetailsStyles } from './hooks'
import { getFormattedAppointmentDateTime } from './utils'

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
}

export default function ShowingAppointmentApproved({ appointment }: Props) {
  const classes = useShowingAppointmentStatusDetailsStyles()
  const theme = useTheme()

  return (
    <Stepper orientation="vertical" className={classes.stepper}>
      <Step>
        <StepLabel
          className={cn(classes.stepLabel, classes.activeStepIconContainer)}
          StepIconComponent={() => (
            <div className={classes.stepIconContainer}>
              <SvgIcon color={theme.palette.common.white} path={mdiCheck} />
            </div>
          )}
        >
          <Typography variant="h6">You're All Set!</Typography>

          <Typography variant="body1" color="textSecondary">
            You set an appointment for{' '}
            <span style={{ color: theme.palette.text.primary }}>
              {getFormattedAppointmentDateTime(appointment)}
            </span>
          </Typography>
        </StepLabel>
        <StepContent className={classes.stepContent}>
          <Button variant="outlined" size="small">
            Add to calendar
          </Button>
        </StepContent>
      </Step>
    </Stepper>
  )
}
