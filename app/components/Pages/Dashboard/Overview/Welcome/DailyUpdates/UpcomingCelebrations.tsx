import { Box, Typography, List } from '@material-ui/core'

import { useBirthdaysAndAnniversaries } from 'hooks/use-birthdays-and-anniversaries'

import { AnimatedLoader } from 'components/AnimatedLoader'

import CalendarEventListItem from 'components/CalendarEvent/ListItem'

const NUMBER_OF_EVENTS_TO_SHOW = 4

export default function UpcomingCelebrations() {
  const { isLoading, events } = useBirthdaysAndAnniversaries()

  // We only need those events which have contacts
  const eventsWithContacts = events.filter(
    evt =>
      evt.people && evt.people.length > 0 && evt.people[0].type === 'contact'
  )

  return (
    <>
      {isLoading && (
        <>
          <AnimatedLoader />
        </>
      )}
      {!isLoading && events.length === 0 && (
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
          {eventsWithContacts.slice(0, NUMBER_OF_EVENTS_TO_SHOW).map(event => (
            <CalendarEventListItem event={event} key={event.id} />
          ))}
        </List>
      )}
    </>
  )
}
