import { useState } from 'react'

import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Grid,
  Button,
  Fade,
  Typography,
  useTheme
} from '@material-ui/core'
import { mdiCalendar } from '@mdi/js'
import { CalendarEvent } from 'calendar-link'

import AddToCalendarButton from '@app/views/components/AddToCalendarButton'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { getFormattedAppointmentDateTime } from '../utils'

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
}

export default function ShowingAppointmentConfirmed({ appointment }: Props) {
  const theme = useTheme()
  const [isCalendarButtonsVisible, setIsCalendarButtonsVisible] =
    useState<boolean>(false)

  const addToCalendarButtonProps: CalendarEvent = {
    title: appointment.showing.title,
    description: `Showing appointment, ${appointment.showing.title}`,
    location: appointment.showing.listing?.property.address.full_address,
    start: appointment.time,
    duration: [appointment.showing.duration, 'seconds']
  }

  return (
    <Stepper orientation="vertical">
      <Step active>
        <StepLabel>
          <Typography variant="h6">You're All Set!</Typography>
        </StepLabel>
        <StepContent>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="body1" color="textSecondary">
                You set an appointment for{' '}
                <span style={{ color: theme.palette.text.primary }}>
                  {getFormattedAppointmentDateTime(appointment)}
                </span>
              </Typography>
            </Grid>
            <Grid
              container
              item
              direction="row"
              alignItems="center"
              spacing={2}
            >
              {!isCalendarButtonsVisible && (
                <Grid item>
                  <Button
                    variant="text"
                    onClick={() => setIsCalendarButtonsVisible(true)}
                  >
                    <SvgIcon path={mdiCalendar} rightMargined />
                    Add To Calendar
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Fade in={isCalendarButtonsVisible} mountOnEnter>
                  <div>
                    <AddToCalendarButton
                      calendar="Google"
                      {...addToCalendarButtonProps}
                    >
                      Google
                    </AddToCalendarButton>
                  </div>
                </Fade>
              </Grid>
              <Grid item>
                <Fade in={isCalendarButtonsVisible} mountOnEnter>
                  <div>
                    <AddToCalendarButton
                      calendar="Outlook"
                      {...addToCalendarButtonProps}
                    >
                      Outlook
                    </AddToCalendarButton>
                  </div>
                </Fade>
              </Grid>
            </Grid>
          </Grid>
        </StepContent>
      </Step>
    </Stepper>
  )
}
