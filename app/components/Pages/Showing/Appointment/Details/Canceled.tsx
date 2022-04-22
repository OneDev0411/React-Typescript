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

export default function ShowingAppointmentCanceled({ appointment }: Props) {
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
          <Typography variant="h6">Appointment Has Been Cancelled!</Typography>
        </StepLabel>
        <StepContent>
          <Typography variant="body1" color="textSecondary">
            {appointment.role_message || appointment.buyer_message ? (
              <>
                <strong>Cancellation Message: </strong>
                {appointment.role_message || appointment.buyer_message}
              </>
            ) : (
              'No cancellation message provided.'
            )}
          </Typography>
        </StepContent>
      </Step>
    </Stepper>
  )
}
