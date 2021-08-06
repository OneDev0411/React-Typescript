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

export default function ShowingAppointmentConfirmed({ appointment }: Props) {
  const theme = useTheme()

  return (
    <Stepper orientation="vertical">
      <Step active>
        <StepLabel>
          <Typography variant="h6">You're All Set!</Typography>
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
    </Stepper>
  )
}
