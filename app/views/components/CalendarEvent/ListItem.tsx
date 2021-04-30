import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import {
  Box,
  Button,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction
} from '@material-ui/core'

import timeago from 'timeago.js'

import { selectUser } from 'selectors/user'

import { Avatar } from 'components/Avatar'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import MarketingTemplatePickerModal from 'components/MarketingTemplatePickers/MarketingTemplatePickerModal'

import { getEventMarketingTemplateTypes } from './helpers'

interface Props {
  event: ICalendarEvent
}

export default function CalendarEventListItem({ event }: Props) {
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

  return (
    <>
      <ListItem>
        <ListItemAvatar>
          {contact ? (
            <Avatar disableLazyLoad size="large" contact={contact} />
          ) : (
            // This is the most aweful way of handling avatar in case contact obj
            // is null. But avatar component has shortcomings and I don't have time
            // to fix it.
            <div />
          )}
        </ListItemAvatar>
        <ListItemText
          primary={event.title}
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
