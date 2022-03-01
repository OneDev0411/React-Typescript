import { Box, Typography, List, Button } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { mdiCalendarToday } from '@mdi/js'
import { browserHistory } from 'react-router'

import { AnimatedLoader } from 'components/AnimatedLoader'
import CalendarEventListItem from 'components/CalendarEvent/ListItem'
import { InlineBadge } from 'components/InlineBadge'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { EmptyState } from '../../components/EmptyState'

const NUMBER_OF_EVENTS_TO_SHOW = 50

interface Props {
  isLoading: boolean
  events: ICalendarEvent[]
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    boxWrapper: {
      flex: 1
    },
    boxTitle: {
      marginBottom: theme.spacing(2),
      display: 'flex',
      alignItems: 'flex-start'
    },
    boxContainer: {
      border: `1px solid ${theme.palette.grey[300]}`,
      padding: theme.spacing(1),
      height: '315px',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      overflowY: 'scroll'
    },
    boxFooter: {
      textAlign: 'right',
      marginTop: theme.spacing(1)
    }
  }),
  { name: 'ThisWeeksSchedule' }
)

export function ThisWeeksSchedule({ isLoading, events }: Props) {
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
      <Typography variant="subtitle1" className={classes.boxTitle}>
        <SvgIcon path={mdiCalendarToday} rightMargined />
        <InlineBadge badgeContent={filteredEvents.length} color="primary">
          To Do
        </InlineBadge>
      </Typography>
      <Box className={classes.boxContainer}>
        {isLoading && (
          <>
            <AnimatedLoader />
          </>
        )}
        {!isLoading && filteredEvents.length === 0 && (
          <EmptyState
            description="You're all caught up!"
            iconSrc="/static/icons/empty-states/letter.svg"
          />
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
        <Button
          variant="text"
          color="primary"
          onClick={() => browserHistory.push('/dashboard/calendar')}
        >
          View Calendar
        </Button>
      </Box>
    </Box>
  )
}
