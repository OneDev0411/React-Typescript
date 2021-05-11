import { WithRouterProps } from 'react-router'
import { useDispatch } from 'react-redux'
import { browserHistory } from 'react-router'
import { Container, Grid, makeStyles } from '@material-ui/core'

import { rescheduleAppointmentRequest } from 'models/showings/reschedule-appointment-request'

import LoadingContainer from 'components/LoadingContainer'
import { addNotification } from 'components/notification'

import InfoSection from '../../Sections/InfoSection'
import DetailsSection from '../../Sections/DetailsSection'
import { usePublicShowingAppointment } from '../../hooks'

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
  const dispatch = useDispatch()
  const { isLoading, appointment } = usePublicShowingAppointment(
    appointmentToken
  )

  const handleSubmitForm = async (time: string, message: string) => {
    const normalizedMessage = message.trim() || undefined

    try {
      await rescheduleAppointmentRequest(appointmentToken, {
        time,
        message: normalizedMessage
      })

      dispatch(
        addNotification({
          status: 'success',
          message: 'Appointment request rescheduled successfully'
        })
      )
      browserHistory.push(`/showings/appointments/${appointmentToken}`)
    } catch (error) {
      console.error(error)
      dispatch(
        addNotification({
          status: 'error',
          message: 'Unable to reschedule appointment request'
        })
      )
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
