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
import { useForm, useWatch, Controller } from 'react-hook-form'

import { addNotification } from 'components/notification'
import LoadingContainer from 'components/LoadingContainer'
import DateSlotPicker from 'components/DateSlotPicker'
import TimeSlotPicker from 'components/TimeSlotPicker'
import { TimeRange } from 'components/TimeSlotPicker/types'

import { cancelAppointmentRequest } from 'models/showings/cancel-appointment-request'
import { getWeekdayName } from 'utils/date-utils'
import { setTime } from 'utils/set-time'

import InfoSection from '../../Sections/InfoSection'
import DetailsSection from '../../Sections/DetailsSection'
import { usePublicShowingAppointment } from '../../hooks'
import { getFormattedAppointmentDateTime } from '../utils'
import {
  getBookableDateRange,
  convertLocalTimeToShowingTime
} from '../../Book/Sections/BookSection/utils'
import { useBookTimeRange } from '../../Book/Sections/BookSection/hooks'

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
    },
    sectionTitleContainer: {
      [theme.breakpoints.down('sm')]: {
        paddingTop: theme.spacing(3)
      }
    },
    contactInfoContainer: {
      margin: 0
    },
    oddContactInfoFieldContainer: {
      [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(2)
      }
    },
    bookButton: {
      [theme.breakpoints.down('xs')]: {
        position: 'fixed',
        zIndex: 1,
        left: 0,
        bottom: 0,
        borderRadius: 0,
        height: theme.spacing(7)
      }
    }
  }),
  {
    name: 'RescheduleAppointment'
  }
)

interface FormFields {
  date: Date
  timeRange: TimeRange
  message: string
}

interface RouteParams {
  appointmentToken: UUID
}

export default function ShowingAppointmentReschedule({
  params: { appointmentToken }
}: WithRouterProps<RouteParams>) {
  const classes = useStyles()
  const theme = useTheme()
  const dispatch = useDispatch()

  const { isLoading, appointment } = usePublicShowingAppointment(
    appointmentToken
  )

  const { handleSubmit, errors, control, formState } = useForm<FormFields>({
    mode: 'onChange'
  })

  const {
    startDate,
    endDate,
    defaultSelectedDate,
    unavailableDates
  } = getBookableDateRange(appointment?.showing)
  const selectedDate = useWatch({
    name: 'date',
    control,
    defaultValue: defaultSelectedDate
  })

  const {
    startTime,
    endTime,
    defaultSelectedTimeRange,
    unavailableTimes
  } = useBookTimeRange(appointment?.showing, selectedDate)
  const selectedTimeRange = useWatch({
    name: 'timeRange',
    control,
    defaultValue: defaultSelectedTimeRange
  })

  const handleSubmitBookForm = ({ date, timeRange, message }: FormFields) => {
    const appointmentTime = setTime(date, timeRange[0])
    const time = convertLocalTimeToShowingTime(
      appointment?.showing,
      appointmentTime
    ).toISOString()

    console.log({ appointmentTime, message, time })
  }

  const showingTimezoneName =
    new Date().getTimezoneOffset() === appointment?.showing.timezone_offset
      ? ''
      : `(${appointment?.showing.timezone})`

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
      browserHistory.push(`/showings/appointments/${appointmentToken}`)
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
                  You’re going to reschedule{' '}
                  <span style={{ color: theme.palette.primary.main }}>
                    {getWeekdayName(appointmentTime)},{' '}
                    {getFormattedAppointmentDateTime(appointment)}
                  </span>{' '}
                  appointment.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box pt={6} pb={1.5} className={classes.sectionTitleContainer}>
                <Typography variant="h6">Pick a date to visit</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="date"
                control={control}
                rules={{
                  required: 'Required'
                }}
                defaultValue={selectedDate ?? null}
                render={({ onChange, value }) => {
                  return (
                    <DateSlotPicker
                      start={startDate}
                      end={endDate}
                      active={value}
                      unavailableDates={unavailableDates}
                      onClick={onChange}
                    />
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box pt={5} pb={1.5} className={classes.sectionTitleContainer}>
                <Typography variant="h6">
                  Pick a time {showingTimezoneName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="timeRange"
                control={control}
                rules={{
                  required: 'Required'
                }}
                defaultValue={selectedTimeRange ?? null}
                render={({ onChange, value }) => {
                  return (
                    <TimeSlotPicker
                      start={startTime}
                      end={endTime}
                      duration={appointment?.showing.duration}
                      active={value}
                      unavailableTimes={unavailableTimes}
                      onClick={onChange}
                    />
                  )
                }}
              />
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
