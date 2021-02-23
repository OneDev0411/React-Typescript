import React from 'react'
import {
  Card,
  Grid,
  Box,
  Button,
  CardContent,
  Typography,
  makeStyles
} from '@material-ui/core'
import timeago from 'timeago.js'

import Link from 'components/ALink'
import { Avatar } from 'components/Avatar'

const useStyles = makeStyles(
  () => ({
    card: {
      minHeight: 200,
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    cardContent: {
      width: '100%'
    }
  }),
  {
    name: 'CalendarEventCard'
  }
)

interface Props {
  event: ICalendarEvent
  onSendGiftCardClick?: () => void
}

export default function CalendarEventCard({
  event,
  onSendGiftCardClick
}: Props) {
  const classes = useStyles()

  const contact =
    event.people &&
    event.people.length > 0 &&
    event.people[0].type === 'contact'
      ? event.people[0]
      : null

  return (
    <Card variant="outlined" className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Grid container direction="column">
          {contact && (
            <Grid container item justify="center">
              <Link noStyle to={`/dashboard/contacts/${contact.id}`}>
                <Box pb={1}>
                  <Avatar size="large" contact={contact} />
                </Box>
              </Link>
            </Grid>
          )}
          <Grid item>
            <Typography variant="body2">{event.title}</Typography>
          </Grid>
          <Grid item>
            <Box pb={2}>
              <Typography variant="body2" color="textSecondary">
                {timeago().format(event.next_occurence)}
              </Typography>
            </Box>
          </Grid>
          {onSendGiftCardClick && (
            <Grid container item>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={onSendGiftCardClick}
              >
                Send Gift Card
              </Button>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}
