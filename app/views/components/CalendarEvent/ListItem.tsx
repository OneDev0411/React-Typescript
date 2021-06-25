import { useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Button,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar as MuiAvatar,
  withStyles,
  Theme
} from '@material-ui/core'

import timeago from 'timeago.js'

import { isToday } from 'date-fns'

import Link from 'components/ALink'

import { selectUser } from 'selectors/user'

import { Avatar } from 'components/Avatar'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import MarketingTemplatePickerModal from 'components/MarketingTemplatePickers/MarketingTemplatePickerModal'
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

export default function CalendarEventListItem({ event }: Props) {
  let avatarIcon
  let Icon
  let linkTitle

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

  linkTitle = event.title

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
    linkTitle = (
      <Link to={`/dashboard/contacts/${contact.id}`}>{linkTitle}</Link>
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

  return (
    <>
      <ListItem>
        <ListItemAvatar>{avatarIcon}</ListItemAvatar>
        <ListItemText primary={linkTitle} secondary={humanizedEventTime} />
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
