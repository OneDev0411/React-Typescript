import React from 'react'
import {
  Card,
  Grid,
  Box,
  Button,
  Tooltip,
  CardContent,
  Typography,
  makeStyles
} from '@material-ui/core'
import timeago from 'timeago.js'

import Link from 'components/ALink'
import { Avatar } from 'components/Avatar'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'

import { getEventMarketingTemplateTypes } from './helpers'

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
}

export default function CalendarEventCard({ event }: Props) {
  const classes = useStyles()

  const contact =
    event.people &&
    event.people.length > 0 &&
    event.people[0].type === 'contact'
      ? event.people[0]
      : null

  const cardTemplateTypes = getEventMarketingTemplateTypes(event)

  return (
    <Card variant="outlined" className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Grid container direction="column">
          {contact && (
            <Grid container item justify="center">
              <Link noStyle to={`/dashboard/contacts/${contact.id}`}>
                <Box pb={1}>
                  <Tooltip placement="top" title={contact.display_name}>
                    <div>
                      <Avatar disableLazyLoad size="xlarge" contact={contact} />
                    </div>
                  </Tooltip>
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
          {cardTemplateTypes && (
            <Grid container item>
              <SendContactCard
                contact={contact}
                mediums="Email"
                types={cardTemplateTypes}
                buttonRenderrer={({ disabled, onClick }) => (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    disabled={disabled}
                    onClick={onClick}
                  >
                    Send Gift Card
                  </Button>
                )}
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}
