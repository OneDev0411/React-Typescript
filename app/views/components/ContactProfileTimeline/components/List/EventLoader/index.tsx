import {
  Box,
  Button,
  makeStyles,
  useTheme,
  Theme,
  CircularProgress
} from '@material-ui/core'

import { CrmEventType } from '../../../types'
import { EmptyState } from '../EmptyState'
import { Event } from '../Event'
import { EventHeader } from '../EventHeader'

const useStyles = makeStyles(
  (theme: Theme) => ({
    eventHeaderContainer: {
      minWidth: theme.spacing(12),
      maxWidth: theme.spacing(13.5)
    },
    eventsSectionContainer: {
      display: 'flex',
      letterSpacing: '0.15px',
      paddingLeft: theme.spacing(2)
    },
    eventsListContainer: {
      width: '100%'
    },
    eventContainer: {
      width: '100%',
      flex: '1 1 auto',
      backgroundColor: '#fff',
      '&:nth-child(even)': {
        backgroundColor: theme.palette.grey['50']
      },
      '&:hover': {
        backgroundColor: theme.palette.grey['100']
      }
    },
    mainContainer: {
      position: 'relative',
      width: '100%',
      height: '100%'
    },
    calendarContainer: {
      position: 'absolute',
      overflowY: 'auto',
      zIndex: 1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    progressLoaderContainer: {
      position: 'absolute',
      zIndex: 10,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.palette.background.paper,
      opacity: 0.6
    },
    progressLoaderIcon: {
      position: 'absolute',
      top: '20%',
      left: '50%'
    },
    loadButton: {
      minWidth: '12rem'
    }
  }),
  {
    name: 'CalendarList'
  }
)

interface Props {
  rows: ICalendarListRow[]
  isLoading: boolean
  onLoadPreviousEvents: () => void
  onLoadNextEvents: () => void
  handleEventChange: (event: IEvent, type: CrmEventType) => void
}

export function EventLoader({
  rows,
  isLoading,
  onLoadPreviousEvents,
  handleEventChange,
  onLoadNextEvents
}: Props) {
  const classes = useStyles({ isToday: true })
  const theme = useTheme()

  const Loader = () =>
    isLoading && (
      <Box className={classes.progressLoaderContainer}>
        <CircularProgress className={classes.progressLoaderIcon} />
      </Box>
    )

  if (rows.length === 0) {
    return (
      <Box className={classes.mainContainer}>
        {Loader()}
        {!isLoading && <EmptyState />}
      </Box>
    )
  }

  return (
    <Box className={classes.mainContainer}>
      {Loader()}
      <Box className={classes.calendarContainer}>
        <Box my={2} textAlign="center">
          <Button
            className={classes.loadButton}
            size="small"
            disabled={isLoading}
            onClick={onLoadPreviousEvents}
          >
            Load Next Year Events
          </Button>
        </Box>
        <Box>
          {rows.map((section, index) => (
            <Box
              className={classes.eventsSectionContainer}
              key={`${section.header.date}-${index}`}
              style={{
                borderBottom: `1px solid ${
                  section.header.isToday
                    ? theme.palette.error.main
                    : theme.palette.action.disabledBackground
                }`
              }}
            >
              <Box className={classes.eventHeaderContainer}>
                <EventHeader item={section.header} />
              </Box>

              <Box className={classes.eventsListContainer}>
                {section.events.map(event => (
                  <div key={event.id} className={classes.eventContainer}>
                    <Event event={event} onEventChange={handleEventChange} />
                  </div>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
        <Box my={2} textAlign="center">
          <Button
            className={classes.loadButton}
            size="small"
            disabled={isLoading}
            onClick={onLoadNextEvents}
          >
            Load Previous Year Events
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
