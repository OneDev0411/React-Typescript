import { WithRouterProps } from 'react-router'
import { Container, Grid, Theme, makeStyles } from '@material-ui/core'

import LoadingContainer from 'components/LoadingContainer'

import { usePublicShowingAppointment } from '../hooks'

import InfoSection from '../Sections/InfoSection'
import ShowingAppointmentStatusSection from './Sections/StatusSection'

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
  appointmentToken: UUID
}

export default function ShowingAppointment({
  params: { appointmentToken }
}: WithRouterProps<RouteParams>) {
  const classes = useStyles()

  const { isLoading, appointment } = usePublicShowingAppointment(
    appointmentToken
  )

  if (isLoading || !appointment) {
    return <LoadingContainer noPaddings style={{ paddingTop: '10%' }} />
  }

  return (
    <Container className={classes.pageContainer}>
      <Grid container direction="row" className={classes.container}>
        <InfoSection showing={appointment.showing} />
        <ShowingAppointmentStatusSection appointment={appointment} />
      </Grid>
    </Container>
  )
}
