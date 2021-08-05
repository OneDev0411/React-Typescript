import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  useTheme
} from '@material-ui/core'

import { getFormattedAppointmentDateTime } from '../utils'

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
}

export default function ShowingAppointmentCompleted({ appointment }: Props) {
  const theme = useTheme()

  return (
    <Stepper orientation="vertical">
      <Step active>
        <StepLabel>
          <Typography variant="h6">Appointment Requested!</Typography>
        </StepLabel>
        <StepContent>
          <Typography>Appointment Requested!</Typography>
          <div>
            <Typography variant="body1" color="textSecondary">
              You set an appointment for{' '}
              <span style={{ color: theme.palette.text.primary }}>
                {getFormattedAppointmentDateTime(appointment)}
              </span>
            </Typography>
          </div>
        </StepContent>
      </Step>

      <Step active>
        <StepLabel>
          <Typography variant="h6">Appointment Completed!</Typography>
        </StepLabel>
      </Step>
    </Stepper>
  )
}
