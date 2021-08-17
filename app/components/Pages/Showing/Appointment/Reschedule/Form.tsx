import {
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

import DateSlotPicker from 'components/DateSlotPicker'
import TimeSlotPicker from 'components/TimeSlotPicker'
import { TimeRange } from 'components/TimeSlotPicker/types'
import { setTime } from 'utils/set-time'

import { useBookTimeRange } from '../../Book/Sections/BookSection/hooks'
import {
  getBookableDateRange,
  convertLocalTimeToShowingTime
} from '../../Book/Sections/BookSection/utils'
import { getFormattedAppointmentDateTime } from '../utils'

const useStyles = makeStyles(
  (theme: Theme) => ({
    sectionTitleContainer: {
      [theme.breakpoints.down('sm')]: {
        paddingTop: theme.spacing(3)
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

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
  onSubmit: (time: string, message: string) => Promise<void>
}

export default function ShowingAppointmentRescheduleForm({
  appointment,
  onSubmit
}: Props) {
  const classes = useStyles()
  const theme = useTheme()

  const { handleSubmit, control, formState } = useForm<FormFields>({
    mode: 'onChange'
  })

  const { startDate, endDate, defaultSelectedDate, unavailableDates } =
    getBookableDateRange(appointment.showing)
  const selectedDate = useWatch({
    name: 'date',
    control,
    defaultValue: defaultSelectedDate
  })

  const { availableRanges, defaultSelectedTimeRange, unavailableTimes } =
    useBookTimeRange(appointment.showing, selectedDate)
  const selectedTimeRange = useWatch({
    name: 'timeRange',
    control,
    defaultValue: defaultSelectedTimeRange
  })

  const handleSubmitRescheduleForm = ({
    date,
    timeRange,
    message
  }: FormFields) => {
    const appointmentTime = setTime(date, timeRange[0])
    const time = convertLocalTimeToShowingTime(
      appointment.showing,
      appointmentTime
    ).toISOString()

    onSubmit(time, message)
  }

  const showingTimezoneName =
    new Date().getTimezoneOffset() === appointment.showing.timezone_offset
      ? ''
      : `(${appointment.showing.timezone})`

  return (
    <form onSubmit={handleSubmit(handleSubmitRescheduleForm)}>
      <Grid item xs={12}>
        <Box mt={3}>
          <Typography variant="h6">
            You’re going to reschedule{' '}
            <span style={{ color: theme.palette.primary.main }}>
              {getFormattedAppointmentDateTime(appointment)}
            </span>{' '}
            appointment.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box pt={6} pb={1.5} className={classes.sectionTitleContainer}>
          <Typography variant="h6">Pick a new date to visit</Typography>
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
            Pick a new time {showingTimezoneName}
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
                availableRanges={availableRanges}
                duration={appointment.showing.duration}
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
            disabled={!formState.isValid || formState.isSubmitting}
          >
            Reschedule Appointment
          </Button>
        </Box>
      </Grid>
    </form>
  )
}
