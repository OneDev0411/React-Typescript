import { Container, Grid, makeStyles } from '@material-ui/core'
import { WithRouterProps, browserHistory } from 'react-router'

import useNotify from '@app/hooks/use-notify'
import LoadingContainer from 'components/LoadingContainer'
import { sendAppointmentFeedback } from 'models/showing/send-appointment-feedback'

import { usePublicShowingAppointment } from '../../hooks'
import DetailsSection from '../../Sections/DetailsSection'
import InfoSection from '../../Sections/InfoSection'

import FeedbackForm from './Form'
import {
  CLIENT_INTEREST_QUESTION,
  OVERALL_EXPERIENCE_QUESTION,
  PRICE_OPINION_QUESTION,
  LISTING_RATE_QUESTION
} from './Form/constants'
import { FormFields } from './Form/types'

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
    name: 'FeedbackAppointment'
  }
)

export default function ShowingAppointmentFeedback({
  params: { appointmentToken }
}: WithRouterProps<RouteParams>) {
  const classes = useStyles()
  const { isLoading, appointment } =
    usePublicShowingAppointment(appointmentToken)
  const notify = useNotify()

  const handleSubmitForm = async ({
    clientInterested,
    overallExperience,
    priceOpinion,
    listingRate,
    comment
  }: FormFields) => {
    const feedbackData: IShowingAppointmentFeedbackInput = {
      answers: [clientInterested, overallExperience, priceOpinion, listingRate],
      questions: [
        CLIENT_INTEREST_QUESTION,
        OVERALL_EXPERIENCE_QUESTION,
        PRICE_OPINION_QUESTION,
        LISTING_RATE_QUESTION
      ],
      comment: comment ?? undefined
    }

    try {
      await sendAppointmentFeedback(appointmentToken, feedbackData)

      notify({
        status: 'success',
        message: 'Feedback sent successfully'
      })
      browserHistory.push(`/showings/appointments/${appointmentToken}`)
    } catch (error) {
      console.error(error)
      notify({
        status: 'error',
        message: 'Unable to send feedback'
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
          <FeedbackForm appointment={appointment} onSubmit={handleSubmitForm} />
        </DetailsSection>
      </Grid>
    </Container>
  )
}
