import { Box } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { useCalendarEvents } from 'hooks/use-calendar-events'

import { TodaysSchedule } from './TodaysSchedule'
import { UpcomingCelebrations } from './UpcomingCelebrations'

const useStyles = makeStyles(
  (theme: Theme) => ({
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(12),
      paddingTop: 0
    }
  }),
  { name: 'DailyUpdates' }
)

export default function DailyUpdates() {
  const classes = useStyles()

  // For sending fewer API requests both UpcomingCelebrations and TodaysSchedule
  // components share the same payload and then will consume the event types
  // based on their needs. For example UpcomingCelebrations only needs
  // 'contact_attribute', 'deal_context' object types.
  // For more details on what kinds of event each objectTypes would provide refer
  // to type CalendarObjectType

  const { isLoading, events } = useCalendarEvents([
    'crm_task',
    'contact',
    'contact_attribute',
    'deal_context'
  ])

  return (
    <Box className={classes.wrapper}>
      <TodaysSchedule isLoading={isLoading} events={events} />
      <UpcomingCelebrations isLoading={isLoading} events={events} />
    </Box>
  )
}
