import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Box,
  Button,
  ListItem,
  ListItemText,
  Link,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar as MuiAvatar,
  withStyles,
  Theme
} from '@material-ui/core'

import timeago from 'timeago.js'

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

  if (contact) {
    avatarIcon = (
      <Link href={`/dashboard/contacts/${contact.id}`}>
        <Avatar disableLazyLoad size="medium" contact={contact} />
      </Link>
    )
  } else {
    Icon = eventTypesIcons[event.event_type].icon
    avatarIcon = (
      <CustomizedMuiAvatar>
        <Icon />
      </CustomizedMuiAvatar>
    )
  }

  return (
    <>
      <ListItem>
        <ListItemAvatar>{avatarIcon}</ListItemAvatar>
        <ListItemText
          primary={
            contact ? (
              <Link underline="none" href={`/dashboard/contacts/${contact.id}`}>
                {event.title}
              </Link>
            ) : (
              event.title
            )
          }
          secondary={timeago().format(event.next_occurence)}
        />
        <ListItemSecondaryAction>
          {cardTemplateTypes && (
            <Box>
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsTemplatePickerOpen(true)}
                >
                  Send Card
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
            </Box>
          )}
        </ListItemSecondaryAction>
      </ListItem>
    </>
  )
}
