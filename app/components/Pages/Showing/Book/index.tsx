import { useEffect, useState } from 'react'
import { WithRouterProps } from 'react-router'
import { useDispatch } from 'react-redux'
import { Container, Grid, Theme, makeStyles } from '@material-ui/core'

import { getPublicShowing } from 'models/showings/get-public-showing'
import { createAppointmentRequest } from 'models/showings/create-appointment-request'

import LoadingContainer from 'components/LoadingContainer'
import { addNotification } from 'components/notification'

import InfoSection from './Sections/InfoSection'
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
  token: string
}

export default function BookShowing({ params }: WithRouterProps<RouteParams>) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [showing, setShowing] = useState<Nullable<IPublicShowing>>(null)
  const token = params.token

  useEffect(() => {
    async function fetchShowing() {
      if (!token) {
        return
      }

      const fetchedShowing = await getPublicShowing(token)

      setShowing(fetchedShowing)
    }

    fetchShowing()
  }, [token])

  if (!showing) {
    // return <div>Getting showing with {token} token.</div>
    return <LoadingContainer />
  }

  const handleSubmitAppointmentRequest = async (
    appointmentData: IShowingAppointmentInput
  ) => {
    try {
      await createAppointmentRequest(token, appointmentData)
      dispatch(
        addNotification({
          status: 'success',
          message: 'Appointment request created successfully'
        })
      )
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
          token={token}
          showing={showing}
          onBook={handleSubmitAppointmentRequest}
        />
      </Grid>
    </Container>
  )
}
