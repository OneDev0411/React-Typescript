import { Grid, Typography } from '@material-ui/core'

import CardSkeleton from 'components/CardSkeleton'
import CalendarEventCard from 'components/CalendarEvent/Card'

import { useCalendarEvents } from 'hooks/use-calendar-events'

import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'

export default function UpcomingBirthdaysAndAnniversariesSection() {
  const { isLoading, events } = useCalendarEvents([
    'contact_attribute',
    'deal_context'
  ])

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
    <SectionLayout
      title="Upcoming Birthdays and Anniversaries"
      actionNode={
        celebrationEvents.length ? (
          <LinkSectionAction title="View all" url="/dashboard/calendar" />
        ) : null
      }
    >
      {isLoading && (
        <>
          <Grid item md={3}>
            <CardSkeleton style={{ height: '200px' }} />
          </Grid>
          <Grid item md={3}>
            <CardSkeleton style={{ height: '200px' }} />
          </Grid>
          <Grid item md={3}>
            <CardSkeleton style={{ height: '200px' }} />
          </Grid>
          <Grid item md={3}>
            <CardSkeleton style={{ height: '200px' }} />
          </Grid>
        </>
      )}
      {!isLoading && celebrationEvents.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary">
            Upcoming birthdays and anniversaries will be here.
          </Typography>
        </Grid>
      )}
      {!isLoading &&
        celebrationEvents.slice(0, 4).map(event => (
          <Grid key={event.id} item xs={6} sm={6} md={3}>
            <CalendarEventCard event={event} />
          </Grid>
        ))}
    </SectionLayout>
  )
}
