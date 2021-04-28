import { useForm, useWatch, Controller } from 'react-hook-form'
import {
  Grid,
  Box,
  Divider,
  Typography,
  Button,
  TextField,
  Hidden,
  makeStyles,
  Theme
} from '@material-ui/core'
import isMobilePhone from 'validator/es/lib/isMobilePhone'
import isEmail from 'validator/es/lib/isEmail'

import DateSlotPicker from 'components/DateSlotPicker'
import TimeSlotPicker from 'components/TimeSlotPicker'
import { TimeRange } from 'components/TimeSlotPicker/types'

import { setTime } from 'utils/set-time'

import { getBookableDateRange, convertLocalTimeToShowingTime } from './utils'
import { useBookTimeRange } from './hooks'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(0, 2, 8)
      },
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(3, 8)
      }
    },
    logo: {
      height: theme.spacing(3)
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
    name: 'ShowingBookSection'
  }
)

interface FormFields {
  date: Date
  timeRange: TimeRange
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  company: string
}

interface Props {
  showing: IPublicShowing
  onBook: (appointmentData: IShowingAppointmentInput) => Promise<void>
}

export default function BookSection({ showing, onBook }: Props) {
  const classes = useStyles()

  const { handleSubmit, errors, control, formState } = useForm<FormFields>({
    mode: 'onChange'
  })

  const {
    startDate,
    endDate,
    defaultSelectedDate,
    unavailableDates
  } = getBookableDateRange(showing)
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
  } = useBookTimeRange(showing, selectedDate)
  const selectedTimeRange = useWatch({
    name: 'timeRange',
    control,
    defaultValue: defaultSelectedTimeRange
  })

  const handleSubmitBookForm = ({
    date,
    timeRange,
    firstName,
    lastName,
    email,
    phoneNumber,
    company
  }: FormFields) => {
    const appointmentTime = setTime(date, timeRange[0])

    const appointmentData: IShowingAppointmentInput = {
      source: 'Website',
      time: convertLocalTimeToShowingTime(
        showing,
        appointmentTime
      ).toISOString(),
      contact: {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email: email || undefined,
        company: company || undefined
      }
    }

    return onBook(appointmentData)
  }

  const showingTimezoneName =
    new Date().getTimezoneOffset() === showing.timezone_offset
      ? ''
      : `(${showing.timezone})`

  return (
    <Grid item xs={12} sm={6} md={7} className={classes.container}>
      <form onSubmit={handleSubmit(handleSubmitBookForm)}>
        <Hidden xsDown>
          <Grid item xs={4} sm={2}>
            <Box pb={2}>
              <img
                className={classes.logo}
                alt="logo"
                src="/static/images/logo.svg"
              />
            </Box>
          </Grid>
        </Hidden>
        <Grid item xs={12}>
          <Divider />
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
                  duration={showing.duration}
                  active={value}
                  unavailableTimes={unavailableTimes}
                  onClick={onChange}
                />
              )
            }}
          />
        </Grid>

        {selectedDate && selectedTimeRange && (
          <>
            <Grid item xs={12}>
              <Box pt={5} pb={1.5} className={classes.sectionTitleContainer}>
                <Typography variant="h6">Enter your contact info</Typography>
              </Box>
            </Grid>

            <Grid
              container
              item
              xs={12}
              className={classes.contactInfoContainer}
            >
              <Grid item xs={12} md={6}>
                <Box pb={2} className={classes.oddContactInfoFieldContainer}>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{
                      required: 'Required'
                    }}
                    defaultValue=""
                    as={
                      <TextField
                        fullWidth
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                        size="small"
                        variant="outlined"
                        label="First Name"
                      />
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box pb={2}>
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{
                      required: 'Required'
                    }}
                    defaultValue=""
                    as={
                      <TextField
                        fullWidth
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                        size="small"
                        variant="outlined"
                        label="Last Name"
                      />
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box pb={2}>
                  <Controller
                    name="company"
                    control={control}
                    defaultValue=""
                    as={
                      <TextField
                        fullWidth
                        error={!!errors.company}
                        helperText={errors.company?.message}
                        size="small"
                        variant="outlined"
                        label="Brokerage"
                      />
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box pb={2} className={classes.oddContactInfoFieldContainer}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      validate: (value: string) => {
                        if (!value) {
                          return true
                        }

                        if (isEmail(value)) {
                          return true
                        }

                        return 'Invalid email address'
                      }
                    }}
                    defaultValue=""
                    as={
                      <TextField
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        size="small"
                        type="email"
                        variant="outlined"
                        label="Email"
                      />
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{
                      required: 'Required',
                      validate: (value: string) => {
                        if (isMobilePhone(value)) {
                          return true
                        }

                        return 'Invalid mobile phone number'
                      }
                    }}
                    defaultValue=""
                    as={
                      <TextField
                        fullWidth
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message}
                        size="small"
                        type="tel"
                        variant="outlined"
                        label="Phone"
                      />
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </>
        )}

        <Grid container item xs={12}>
          <Box width="100%" pt={5}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              className={classes.bookButton}
              disabled={!formState.isValid || formState.isSubmitting}
            >
              Book This Showing
            </Button>
          </Box>
        </Grid>
      </form>
    </Grid>
  )
}
