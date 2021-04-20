import { makeStyles } from '@material-ui/core'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@material-ui/lab'

const useStyles = makeStyles(
  () => ({
    timeline: {
      alignItems: 'flex-start'
    }
  }),
  {
    name: 'ShowingAppointmentTimeline'
  }
)

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
}

export default function ShowingAppointmentTimeline({ appointment }: Props) {
  const classes = useStyles()

  return (
    <Timeline align="left" className={classes.timeline}>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Eat</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Code</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
        </TimelineSeparator>
        <TimelineContent>Sleep</TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
