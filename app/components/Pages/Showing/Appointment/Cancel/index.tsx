import { WithRouterProps } from 'react-router'
import { useDispatch } from 'react-redux'
import { browserHistory } from 'react-router'
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Theme,
  makeStyles,
  useTheme
} from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

import LoadingContainer from 'components/LoadingContainer'
import { addNotification } from 'components/notification'

import { cancelAppointmentRequest } from 'models/showings/cancel-appointment-request'
import { getWeekdayName } from 'utils/date-utils'

import InfoSection from '../../Sections/InfoSection'
import DetailsSection from '../../Sections/DetailsSection'
import { usePublicShowingAppointment } from '../../hooks'
import { getFormattedAppointmentDateTime } from '../utils'

const useStyles = makeStyles(
  (theme: Theme) => ({
    pageContainer: {
      maxWidth: '100%',
      padding: 0
    },
    container: {
      [theme.breakpoints.up('sm')]: {
        minHeight: '100vh'
      }
    }
  }),
  {
    name: 'CancelAppointment'
  }
)

interface FormFields {
  message: string
}

interface RouteParams {
  appointmentToken: UUID
}

export default function ShowingAppointmentCancel({
  params: { appointmentToken }
}: WithRouterProps<RouteParams>) {
  const classes = useStyles()
  const theme = useTheme()
  const dispatch = useDispatch()

  const { handleSubmit, control, formState } = useForm<FormFields>({
    mode: 'onChange'
  })

  const { isLoading, appointment } = usePublicShowingAppointment(
    appointmentToken
  )

  const handleSubmitCancelForm = async ({ message }: FormFields) => {
    const normalizedMessage = message.trim() || undefined

    try {
      await cancelAppointmentRequest(appointmentToken, normalizedMessage)

      dispatch(
        addNotification({
          status: 'success',
          message: 'Appointment request canceled successfully'
        })
      )

      if (appointment) {
        browserHistory.push(
          `/showings/appointments/${appointment.showing.slug}-${appointment.showing.id}`
        )
      }
    } catch (error) {
      console.error(error)
      dispatch(
        addNotification({
          status: 'error',
          message: 'Unable to cancel appointment request'
        })
      )
    }
  }

  if (isLoading || !appointment) {
    return <LoadingContainer />
  }

  const appointmentTime = new Date(appointment.time)

  return (
    <Container className={classes.pageContainer}>
      <Grid container direction="row" className={classes.container}>
        <InfoSection showing={appointment.showing} />
        <DetailsSection>
          <form onSubmit={handleSubmit(handleSubmitCancelForm)}>
            <Grid item xs={12}>
              <Box mt={3}>
                <Typography variant="h6">
                  You’re going to cancel{' '}
                  <span style={{ color: theme.palette.primary.main }}>
                    {getWeekdayName(appointmentTime)},{' '}
                    {getFormattedAppointmentDateTime(appointment)}
                  </span>{' '}
                  appointment.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box mt={4}>
                <Typography variant="h6">Leave a message</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box mt={3}>
                <Controller
                  name="message"
                  control={control}
                  as={
                    <TextField
                      multiline
                      fullWidth
                      rows={4}
                      placeholder="You can write some message or explanation here if you want to"
                      variant="outlined"
                      label="Message"
                    />
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box mt={4}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={formState.isSubmitting}
                >
                  Cancel Appointment
                </Button>
              </Box>
            </Grid>
          </form>
        </DetailsSection>
      </Grid>
    </Container>
  )
}
