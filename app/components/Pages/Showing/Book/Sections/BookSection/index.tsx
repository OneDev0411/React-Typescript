import { useState } from 'react'
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

import DateSlotPicker from 'components/DateSlotPicker'
import TimeSlotPicker from 'components/TimeSlotPicker'
import { TimeRange } from 'components/TimeSlotPicker/types'

import { getBookableDateRange } from './utils'
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

interface Props {
  showing: IPublicShowing

  onBook: (appointmentData: IAppointmentInput) => void
}

export default function BookSection({ showing, onBook }: Props) {
  const classes = useStyles()
  const { startDate, endDate, unavailableDates } = getBookableDateRange(showing)
  const [selectedDate, setSelectedDate] = useState<Nullable<Date>>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    Nullable<TimeRange>
  >(null)
  const { startTime, endTime, unavailableTimes } = useBookTimeRange(
    showing,
    selectedDate ?? undefined
  )

  const handleChangeSelectedDate = (date: Date) => {
    setSelectedDate(date)
    setSelectedTimeRange(null)
  }

  const handleChangeSelectedTimeRange = (timeRange: TimeRange) => {
    setSelectedTimeRange(timeRange)
  }

  return (
    <Grid item xs={12} sm={6} md={6} className={classes.container}>
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
        <DateSlotPicker
          start={startDate}
          end={endDate}
          active={selectedDate ?? undefined}
          unavailableDates={unavailableDates}
          onClick={handleChangeSelectedDate}
        />
      </Grid>

      {selectedDate && (
        <>
          <Grid item xs={12}>
            <Box pt={5} pb={1.5} className={classes.sectionTitleContainer}>
              <Typography variant="h6">Pick a time</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TimeSlotPicker
              start={startTime}
              end={endTime}
              duration={showing.duration}
              active={selectedTimeRange ?? undefined}
              unavailableTimes={unavailableTimes}
              onClick={handleChangeSelectedTimeRange}
            />
          </Grid>
        </>
      )}

      {selectedDate && (
        <>
          <Grid item xs={12}>
            <Box pt={5} pb={1.5} className={classes.sectionTitleContainer}>
              <Typography variant="h6">Enter your contact info</Typography>
            </Box>
          </Grid>

          <Grid container item xs={12} className={classes.contactInfoContainer}>
            <Grid item xs={12} md={6}>
              <Box pb={2} className={classes.oddContactInfoFieldContainer}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="First Name"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box pb={2}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Last Name"
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box pb={2}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Brokerage"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box pb={2} className={classes.oddContactInfoFieldContainer}>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  variant="outlined"
                  label="Email"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  type="tel"
                  variant="outlined"
                  label="Phone"
                />
              </Box>
            </Grid>
          </Grid>

          <Grid container item xs={12}>
            <Box width="100%" pt={5}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.bookButton}
                disabled={!selectedTimeRange}
              >
                Book This Showing
              </Button>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  )
}
