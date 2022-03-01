import { Box, Typography, List } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { mdiGiftOutline } from '@mdi/js'

import { AnimatedLoader } from 'components/AnimatedLoader'
import CalendarEventListItem from 'components/CalendarEvent/ListItem'
import { InlineBadge } from 'components/InlineBadge'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { EmptyState } from '../../components/EmptyState'

interface Props {
  isLoading: boolean
  events: ICalendarEvent[]
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    boxWrapper: {
      marginLeft: theme.spacing(2),
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
      marginTop: theme.spacing(2)
    }
  }),
  { name: 'UpcomingCelebrations' }
)

export function UpcomingCelebrations({ isLoading, events }: Props) {
  const classes = useStyles()

  const celebrationsEventTypes = [
    'wedding_anniversary',
    'birthday',
    'child_birthday',
    'home_anniversary'
  ]

  // We just need to show events related to above list in this box
  const celebrationEvents = events.filter(event =>
    celebrationsEventTypes.includes(event.event_type)
  )

  return (
    <Box className={classes.boxWrapper}>
      <Typography variant="subtitle1" className={classes.boxTitle}>
        <SvgIcon path={mdiGiftOutline} rightMargined />

        <InlineBadge badgeContent={celebrationEvents.length} color="primary">
          To Contact
        </InlineBadge>
      </Typography>
      <Box className={classes.boxContainer}>
        {isLoading && (
          <>
            <AnimatedLoader />
          </>
        )}
        {!isLoading && celebrationEvents.length === 0 && (
          <EmptyState
            description="Your Birthdays and Anniversaries will Populate Here"
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
      <Box className={classes.boxFooter} />
    </Box>
  )
}
