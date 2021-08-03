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

export default function ShowingAppointmentRequested({ appointment }: Props) {
  const theme = useTheme()

  return (
    <Stepper orientation="vertical">
      <Step active>
        <StepLabel>
          <Typography variant="h6">Appointment Requested!</Typography>
        </StepLabel>
        <StepContent>
          <Typography variant="body1" color="textSecondary">
            You set an appointment for{' '}
            <span style={{ color: theme.palette.text.primary }}>
              {getFormattedAppointmentDateTime(appointment)}
            </span>
          </Typography>
        </StepContent>
      </Step>

      <Step active>
        <StepLabel>
          <Typography variant="h6">Pending Agent Approval</Typography>
        </StepLabel>
        <StepContent>
          <Typography variant="body1" color="textSecondary">
            Your request was sent to the agent, once he approves it, we will
            email and text you your confirmation.
          </Typography>
        </StepContent>
      </Step>
    </Stepper>
  )
}
