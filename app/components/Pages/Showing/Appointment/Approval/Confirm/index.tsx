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
import { WithRouterProps, browserHistory } from 'react-router'

import useNotify from '@app/hooks/use-notify'
import { approvalConfirmAppointmentRequest } from '@app/models/showing/approval-confirm-appointment-request'
import LoadingContainer from '@app/views/components/LoadingContainer'

import { usePublicShowingAppointment } from '../../../hooks'
import DetailsSection from '../../../Sections/DetailsSection'
import InfoSection from '../../../Sections/InfoSection'
import { getFormattedAppointmentDateTime } from '../../utils'

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
    name: 'ApprovalConfirmAppointment'
  }
)

interface FormFields {
  comment: string
}

interface RouteParams {
  appointmentToken: UUID
}

export default function ShowingApprovalAppointmentConfirm({
  params: { appointmentToken }
}: WithRouterProps<RouteParams>) {
  const classes = useStyles()
  const theme = useTheme()
  const notify = useNotify()

  const { handleSubmit, control, formState } = useForm<FormFields>({
    mode: 'onChange'
  })

  const { isLoading, appointment } =
    usePublicShowingAppointment(appointmentToken)

  const handleSubmitConfirmForm = async ({ comment }: FormFields) => {
    const normalizedMessage = comment.trim() || undefined

    try {
      await approvalConfirmAppointmentRequest(
        appointmentToken,
        normalizedMessage
      )

      notify({
        status: 'success',
        message: 'Appointment request confirmed successfully'
      })

      if (appointment) {
        browserHistory.push(
          `/showings/${appointment.showing.slug}-${appointment.showing.id}/book`
        )
      }
    } catch (error) {
      console.error(error)
      notify({
        status: 'error',
        message: 'Unable to confirm appointment request'
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
          <form onSubmit={handleSubmit(handleSubmitConfirmForm)}>
            <Grid item xs={12}>
              <Box mt={3}>
                <Typography variant="h6">
                  You are confirming your{' '}
                  <span style={{ color: theme.palette.primary.main }}>
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
                  name="comment"
                  control={control}
                  defaultValue=""
                  as={
                    <TextField
                      multiline
                      fullWidth
                      rows={4}
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
                  Confirm Appointment
                </Button>
              </Box>
            </Grid>
          </form>
        </DetailsSection>
      </Grid>
    </Container>
  )
}
