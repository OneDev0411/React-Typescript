import React from 'react'
import { Grid } from '@material-ui/core'

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
        <LinkSectionAction
          title="View all birthdays and anniversaries"
          url="/dashboard/calendar"
        />
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
      {!isLoading &&
        events.slice(0, 4).map(event => (
          <Grid key={event.id} item md={3}>
            <CalendarEventCard event={event} />
          </Grid>
        ))}
    </SectionLayout>
  )
}
