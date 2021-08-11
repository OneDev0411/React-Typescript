import { Container, Grid, Theme, makeStyles } from '@material-ui/core'
import { WithRouterProps, browserHistory } from 'react-router'

import useNotify from '@app/hooks/use-notify'
import LoadingContainer from 'components/LoadingContainer'
import { createAppointmentRequest } from 'models/showing/create-appointment-request'

import { usePublicShowing } from '../hooks'
import InfoSection from '../Sections/InfoSection'

import BookSection from './Sections/BookSection'

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
  slugAndId: string
}

export default function BookShowing({
  params: { slugAndId }
}: WithRouterProps<RouteParams>) {
  const id = Number(slugAndId.split('-').pop())

  const notify = useNotify()
  const classes = useStyles()
  const { showing, isLoading } = usePublicShowing(id)

  if (isLoading || !showing) {
    return <LoadingContainer noPaddings style={{ paddingTop: '10%' }} />
  }

  const handleSubmitAppointmentRequest = async (
    appointmentData: IShowingAppointmentInput
  ) => {
    try {
      const appointment = await createAppointmentRequest(id, appointmentData)

      notify({
        status: 'success',
        message: 'Appointment request created successfully'
      })
      browserHistory.push(`/showings/appointments/${appointment.token}`)
    } catch (error) {
      console.error(error)
      notify({
        status: 'error',
        message: 'Unable to create appointment request'
      })
    }
  }

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
