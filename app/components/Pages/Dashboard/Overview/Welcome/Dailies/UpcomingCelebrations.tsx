import { Box, List, Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { AnimatedLoader } from '@app/views/components/AnimatedLoader'
import CalendarEventListItem from '@app/views/components/CalendarEvent/ListItem'
import { InlineBadge } from '@app/views/components/InlineBadge'

import { EmptyState } from '../../components/EmptyState'
import { celebrationsEventTypes } from '../../variables'

const useStyles = makeStyles(
  (theme: Theme) => ({
    boxHeader: {
      alignItems: 'center',
      display: 'flex',
      height: '48px',
      justifyContent: 'space-between'
    },
    boxWrapper: {
      flex: 1,
      marginLeft: theme.spacing(2),
      marginBottom: theme.spacing(5)
    },
    boxTitle: {
      display: 'flex',
      alignItems: 'flex-start'
    },
    boxContainer: {
      border: `1px solid ${theme.palette.grey[300]}`,
      padding: theme.spacing(1),
      height: '300px',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.common.white,
      overflowY: 'scroll'
    }
  }),
  { name: 'UpcomingCelebrations' }
)

interface Props {
  isLoading: boolean
  events: ICalendarEvent[]
}

export function UpcomingCelebrations({ isLoading, events }: Props) {
  const classes = useStyles()

  // We just need to show events related to celebrations-event-types in this box
  const celebrationEvents = events.filter(event =>
    celebrationsEventTypes.includes(event.event_type)
  )

  return (
    <Box className={classes.boxWrapper}>
      <Box className={classes.boxHeader}>
        <Typography variant="h6" className={classes.boxTitle}>
          <InlineBadge badgeContent={celebrationEvents.length} color="primary">
            To Contact
          </InlineBadge>
        </Typography>
      </Box>
      <Box className={classes.boxContainer}>
        {isLoading && (
          <>
            <AnimatedLoader />
          </>
        )}
        {!isLoading && celebrationEvents.length === 0 && (
          <EmptyState
            description="Your clients’ birthdays and home anniversaries will populate here. Remember to celebrate it with them, it only takes a click!"
            iconSrc="/static/icons/empty-states/congrats.svg"
          />
        )}
        {!isLoading && (
          <List>
            {celebrationEvents.map(event => (
              <CalendarEventListItem event={event} key={event.id} />
            ))}
          </List>
        )}
      </Box>
    </Box>
  )
}
