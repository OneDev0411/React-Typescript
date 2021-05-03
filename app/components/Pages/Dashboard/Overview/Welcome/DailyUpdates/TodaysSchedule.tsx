import { Box, Typography, List } from '@material-ui/core'

import { useInteractions } from 'hooks/use-interactions'

import { AnimatedLoader } from 'components/AnimatedLoader'

import CalendarEventListItem from 'components/CalendarEvent/ListItem'

const NUMBER_OF_EVENTS_TO_SHOW = 4

export default function TodaysSchedule() {
  const { isLoading, events } = useInteractions()

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
            You're all caught up for today!
          </Typography>
        </Box>
      )}
      {!isLoading && (
        <List>
          {events.slice(0, NUMBER_OF_EVENTS_TO_SHOW).map(event => (
            <CalendarEventListItem event={event} key={event.id} />
          ))}
        </List>
      )}
    </>
  )
}
