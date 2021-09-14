import { Container, Grid, makeStyles } from '@material-ui/core'
import { WithRouterProps, browserHistory } from 'react-router'

import useNotify from '@app/hooks/use-notify'
import LoadingContainer from 'components/LoadingContainer'
import { rescheduleAppointmentRequest } from 'models/showing/reschedule-appointment-request'

import { usePublicShowingAppointment } from '../../hooks'
import DetailsSection from '../../Sections/DetailsSection'
import InfoSection from '../../Sections/InfoSection'

import RescheduleForm from './Form'

interface RouteParams {
  appointmentToken: UUID
}

const useStyles = makeStyles(
  theme => ({
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
    name: 'RescheduleAppointment'
  }
)

export default function ShowingAppointmentReschedule({
  params: { appointmentToken }
}: WithRouterProps<RouteParams>) {
  const classes = useStyles()
  const { isLoading, appointment } =
    usePublicShowingAppointment(appointmentToken)
  const notify = useNotify()

  const handleSubmitForm = async (time: string, message: string) => {
    const normalizedMessage = message.trim() || undefined

    try {
      await rescheduleAppointmentRequest(appointmentToken, {
        time,
        message: normalizedMessage
      })

      notify({
        status: 'success',
        message: 'Appointment request rescheduled successfully'
      })
      browserHistory.push(`/showings/appointments/${appointmentToken}`)
    } catch (error) {
      console.error(error)
      notify({
        status: 'error',
        message: 'Unable to reschedule appointment request'
      })
    }
  }

  if (isLoading || !appointment) {
    return <LoadingContainer noPaddings style={{ paddingTop: '10%' }} />
  }

  return (
    <Container className={classes.pageContainer}>
      <Grid container direction="row" className={classes.container}>
        <InfoSection showing={appointment.showing} />
        <DetailsSection>
          <RescheduleForm
            appointment={appointment}
            onSubmit={handleSubmitForm}
          />
        </DetailsSection>
      </Grid>
    </Container>
  )
}
