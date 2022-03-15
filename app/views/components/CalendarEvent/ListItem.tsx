import { useState, useMemo } from 'react'

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
import { useSelector } from 'react-redux'

import { isDealEvent } from '@app/views/components/GridCalendar/helpers/normalize-events/helpers/event-checker'
import { getTitle } from '@app/views/components/GridCalendar/helpers/normalize-events/helpers/get-title'
import Link from 'components/ALink'
import { Avatar } from 'components/Avatar'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import MarketingTemplatePickerModal from 'components/MarketingTemplatePickers/MarketingTemplatePickerModal'
import { selectUser } from 'selectors/user'
import { fromNow } from 'utils/date-utils'
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
    },
    itemText: {
      '& a': {
        paddingRight: theme.spacing(2),
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2 /* number of lines to show */,
        'line-clamp': 2,
        '-webkit-box-orient': 'vertical'
      }
    }
  }),
  { name: 'CalendarListItem' }
)

export default function CalendarEventListItem({ event }: Props) {
  let avatarIcon
  let Icon
  let eventSubTitle
  let eventTitleLink
  const eventTitle = getTitle(event)

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

  const cardTemplateTypes = getEventMarketingTemplateTypes(event)

  const humanizedEventTime = useMemo(() => {
    const eventTime = new Date(event.next_occurence)

    return fromNow(eventTime)
  }, [event.next_occurence])

  // Build avatars
  if (contact && contact.profile_image_url) {
    avatarIcon = (
      <Link to={`/dashboard/contacts/${contact.id}`}>
        <Avatar disableLazyLoad size="medium" contact={contact} />
      </Link>
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

  // Build titles
  if (isDealEvent(event)) {
    eventTitleLink = (
      <Link to={`/dashboard/deals/${event.deal}`}>{eventTitle}</Link>
    )
  }

  if (contact) {
    eventTitleLink = (
      <Link to={`/dashboard/contacts/${contact.id}`}>{eventTitle}</Link>
    )
  }

  // Build subTitles
  eventSubTitle = `${humanizedEventTime}`

  if (event.type === 'home_anniversary' && contact) {
    eventSubTitle = `${eventTitle} ${humanizedEventTime}`
  }

  return (
    <>
      <ListItem classes={{ secondaryAction: classes.listItemWithButton }}>
        <ListItemAvatar>{avatarIcon}</ListItemAvatar>
        <ListItemText
          className={classes.itemText}
          primary={eventTitleLink || eventTitle}
          secondary={eventSubTitle}
        />
        {cardTemplateTypes && (
          <ListItemSecondaryAction>
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
          </ListItemSecondaryAction>
        )}
      </ListItem>
    </>
  )
}
