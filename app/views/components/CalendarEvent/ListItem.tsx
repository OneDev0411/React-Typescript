import { useState } from 'react'

import {
  Button,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar as MuiAvatar,
  withStyles,
  makeStyles,
  Theme
} from '@material-ui/core'
import { isToday } from 'date-fns'
import { useSelector } from 'react-redux'
import timeago from 'timeago.js'

import Link from 'components/ALink'
import { Avatar } from 'components/Avatar'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import MarketingTemplatePickerModal from 'components/MarketingTemplatePickers/MarketingTemplatePickerModal'
import { selectUser } from 'selectors/user'
import { eventTypesIcons } from 'views/utils/event-types-icons'

import { getEventMarketingTemplateTypes } from './helpers'

interface Props {
  event: ICalendarEvent
}

// Customizing MUI Avatar backgroundColor
const CustomizedMuiAvatar = withStyles((theme: Theme) => ({
  colorDefault: {
    backgroundColor: theme.palette.grey['200']
  }
}))(MuiAvatar)

const useStyles = makeStyles(
  (theme: Theme) => ({
    listItemWithButton: {
      paddingRight: theme.spacing(12)
    }
  }),
  { name: 'CalendarListItem' }
)

export default function CalendarEventListItem({ event }: Props) {
  let avatarIcon
  let Icon
  let eventTitle
  let eventSubTitle

  const classes = useStyles()

  const user = useSelector(selectUser)
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] =
    useState<boolean>(false)
  const [selectedTemplate, setSelectedTemplate] =
    useState<Nullable<IBrandMarketingTemplate>>(null)

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

  eventTitle = event.title

  const cardTemplateTypes = getEventMarketingTemplateTypes(event)
  const eventTime = new Date(event.next_occurence)
  const humanizedEventTime = isToday(eventTime)
    ? 'Today'
    : timeago().format(eventTime)

  if (contact) {
    avatarIcon = (
      <Link to={`/dashboard/contacts/${contact.id}`}>
        <Avatar disableLazyLoad size="medium" contact={contact} />
      </Link>
    )
    eventTitle = (
      <Link to={`/dashboard/contacts/${contact.id}`}>{eventTitle}</Link>
    )
  } else if (eventTypesIcons[event.event_type]) {
    Icon = eventTypesIcons[event.event_type].icon
    avatarIcon = (
      <CustomizedMuiAvatar>
        <Icon />
      </CustomizedMuiAvatar>
    )
  } else {
    avatarIcon = <CustomizedMuiAvatar />
  }

  switch (event.event_type) {
    case 'closing_date':
    case 'contract_date':
    case 'inspection_date':
    case 'possession_date':
    case 'expiration_date':
    case 'option_period':
      eventTitle = (
        <Link to={`/dashboard/deals/${event.deal}`}>
          {event.type_label} of {eventTitle}
        </Link>
      )
      break
    case 'home_anniversary':
      if (contact) {
        eventSubTitle = `Home anniversary of ${contact.display_name} ${humanizedEventTime}`
      }

      break
    default:
      eventSubTitle = humanizedEventTime
  }

  return (
    <>
      <ListItem classes={{ secondaryAction: classes.listItemWithButton }}>
        <ListItemAvatar>{avatarIcon}</ListItemAvatar>
        <ListItemText primary={eventTitle} secondary={eventSubTitle} />
        <ListItemSecondaryAction>
          {cardTemplateTypes && (
            <div>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsTemplatePickerOpen(true)}
              >
                Send Card
              </Button>
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
            </div>
          )}
        </ListItemSecondaryAction>
      </ListItem>
    </>
  )
}
