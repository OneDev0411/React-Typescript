import { Grid, Typography } from '@material-ui/core'

import CardSkeleton from 'components/CardSkeleton'
import CalendarEventCard from 'components/CalendarEventCard'

import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'
import { useBirthdaysAndAnniversaries } from './hooks'

export default function UpcomingBirthdaysAndAnniversariesSection() {
  const { isLoading, events } = useBirthdaysAndAnniversaries()

  return (
    <SectionLayout
      title="Upcoming Birthdays and Anniversaries"
      actionNode={
        events.length ? (
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
      {!isLoading && events.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary">
            Upcoming birthdays and anniversaries will be here.
          </Typography>
        </Grid>
      )}
      {!isLoading &&
        events.slice(0, 4).map(event => (
          <Grid key={event.id} item xs={6} sm={6} md={3}>
            <CalendarEventCard event={event} />
          </Grid>
        ))}
    </SectionLayout>
  )
}
