import { Box, Typography, List, Link } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { mdiCalendarToday } from '@mdi/js'

import { InlineBadge } from 'components/InlineBadge'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { AnimatedLoader } from 'components/AnimatedLoader'

import CalendarEventListItem from 'components/CalendarEvent/ListItem'

const NUMBER_OF_EVENTS_TO_SHOW = 4

interface Props {
  isLoading: boolean
  events: ICalendarEvent[]
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    boxWrapper: {
      marginLeft: theme.spacing(2),
      flex: 1,
      maxWidth: '600px'
    },
    boxTitle: {
      marginBottom: theme.spacing(2),
      display: 'flex',
      alignItems: 'flex-start',
      fontSize: '16px'
    },
    boxContainer: {
      border: `1px solid ${theme.palette.grey[300]}`,
      padding: theme.spacing(2),
      height: '350px',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper
    },
    boxFooter: {
      textAlign: 'right',
      marginTop: theme.spacing(2)
    }
  }),
  { name: 'TodaysSchedule' }
)

export function TodaysSchedule({ isLoading, events }: Props) {
  const classes = useStyles()

  const celebrationsEventTypes = [
    'wedding_anniversary',
    'birthday',
    'child_birthday',
    'home_anniversary'
  ]

  // We just need to show events not in the list above
  const filteredEvents = events.filter(
    event => !celebrationsEventTypes.includes(event.event_type)
  )

  return (
    <Box className={classes.boxWrapper}>
      <Typography variant="h6" className={classes.boxTitle}>
        <SvgIcon path={mdiCalendarToday} rightMargined />
        <InlineBadge badgeContent={filteredEvents.length} color="primary">
          Today's Schedule
        </InlineBadge>
      </Typography>
      <Box className={classes.boxContainer}>
        {isLoading && (
          <>
            <AnimatedLoader />
          </>
        )}
        {!isLoading && filteredEvents.length === 0 && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height={1}
          >
            <Typography variant="body1">
              You have no upcoming birthdays or anniversaries.
            </Typography>
          </Box>
        )}
        {!isLoading && (
          <List>
            {filteredEvents.slice(0, NUMBER_OF_EVENTS_TO_SHOW).map(event => (
              <CalendarEventListItem event={event} key={event.id} />
            ))}
          </List>
        )}
      </Box>
      <Box className={classes.boxFooter}>
        <Link href="#">View Calendar</Link>
      </Box>
    </Box>
  )
}
