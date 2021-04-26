import { useState } from 'react'
import { useSelector } from 'react-redux'
import { isToday } from 'date-fns'
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

import { selectUser } from 'selectors/user'

import Link from 'components/ALink'
import { Avatar } from 'components/Avatar'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import MarketingTemplatePickerModal from 'components/MarketingTemplatePickers/MarketingTemplatePickerModal'

import { getEventMarketingTemplateTypes } from './helpers'

const useStyles = makeStyles(
  () => ({
    card: {
      minHeight: 200,
      height: '100%',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    cardContent: {
      width: '100%',
      height: '100%'
    },
    contentContainer: {
      height: '100%'
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
  console.log({ event })

  const classes = useStyles()
  const user = useSelector(selectUser)
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState<boolean>(
    false
  )
  const [selectedTemplate, setSelectedTemplate] = useState<
    Nullable<IBrandMarketingTemplate>
  >(null)

  const handleSelectTemplate = (template: IBrandMarketingTemplate) => {
    setSelectedTemplate(template)
    setIsTemplatePickerOpen(false)
  }

  const contact =
    event.people &&
    event.people.length > 0 &&
    event.people[0].type === 'contact'
      ? event.people[0]
      : null

  const cardTemplateTypes = getEventMarketingTemplateTypes(event)

  const eventTime = new Date(event.next_occurence)
  const humanizedEventTime = isToday(eventTime)
    ? 'Today'
    : timeago().format(eventTime)

  return (
    <Card variant="outlined" className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Grid
          container
          direction="column"
          justify="space-between"
          className={classes.contentContainer}
        >
          <Grid container item direction="column">
            {contact && (
              <Grid container item justify="center">
                <Link noStyle to={`/dashboard/contacts/${contact.id}`}>
                  <Box pb={1}>
                    <Tooltip placement="top" title={contact.display_name}>
                      <div>
                        <Avatar
                          disableLazyLoad
                          size="xlarge"
                          contact={contact}
                        />
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
                  {humanizedEventTime}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          {cardTemplateTypes && (
            <Grid container item>
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={() => setIsTemplatePickerOpen(true)}
                >
                  Send eCard
                </Button>
              </>
              {isTemplatePickerOpen && (
                <MarketingTemplatePickerModal
                  title="Select Template"
                  user={user}
                  mediums={['Email']}
                  templateTypes={cardTemplateTypes}
                  onSelect={handleSelectTemplate}
                  onClose={() => setIsTemplatePickerOpen(false)}
                />
              )}
              {selectedTemplate && (
                <SendContactCard
                  isBuilderOpen
                  selectedTemplate={selectedTemplate}
                  contact={contact}
                  types={cardTemplateTypes}
                  mediums="Email"
                  handleTrigger={() => setSelectedTemplate(null)}
                  buttonRenderrer={() => null}
                />
              )}
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}
