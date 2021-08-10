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

export default function ShowingAppointmentRescheduled({ appointment }: Props) {
  const theme = useTheme()

  return (
    <Stepper orientation="vertical">
      <Step active>
        <StepLabel>
          <Typography variant="h6">
            Appointment Reschedule Requested!
          </Typography>
        </StepLabel>
        <StepContent>
          <Typography variant="body1" color="textSecondary">
            You've requested to reschedule your appointment for{' '}
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
            Your reschedule request was sent to the agent, once he approves it,
            we will email and text you your confirmation. <br />
            {appointment.buyer_message && (
              <>
                <strong>Reschedule Message: </strong>
                {appointment.buyer_message}
              </>
            )}
          </Typography>
        </StepContent>
      </Step>
    </Stepper>
  )
}
