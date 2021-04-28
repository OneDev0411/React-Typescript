import { WithRouterProps } from 'react-router'
import { useDispatch } from 'react-redux'
import { Container, Grid, Theme, makeStyles } from '@material-ui/core'
import { browserHistory } from 'react-router'

import { createAppointmentRequest } from 'models/showings/create-appointment-request'

import LoadingContainer from 'components/LoadingContainer'
import { addNotification } from 'components/notification'

import InfoSection from '../Sections/InfoSection'
import BookSection from './Sections/BookSection'
import { usePublicShowing } from '../hooks'

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
    name: 'BookShowing'
  }
)

interface RouteParams {
  token: string
}

export default function BookShowing({
  params: { token }
}: WithRouterProps<RouteParams>) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { showing, isLoading } = usePublicShowing(token)

  if (isLoading || !showing) {
    return <LoadingContainer />
  }

  const handleSubmitAppointmentRequest = async (
    appointmentData: IShowingAppointmentInput
  ) => {
    try {
      const appointment = await createAppointmentRequest(token, appointmentData)

      dispatch(
        addNotification({
          status: 'success',
          message: 'Appointment request created successfully'
        })
      )
      browserHistory.push(`/showings/appointments/${appointment.token}`)
    } catch (error) {
      console.error(error)
      dispatch(
        addNotification({
          status: 'error',
          message: 'Unable to create appointment request'
        })
      )
    }
  }

  console.log({ showing })

  return (
    <Container className={classes.pageContainer}>
      <Grid container direction="row" className={classes.container}>
        <InfoSection showing={showing} />
        <BookSection
          showing={showing}
          onBook={handleSubmitAppointmentRequest}
        />
      </Grid>
    </Container>
  )
}
