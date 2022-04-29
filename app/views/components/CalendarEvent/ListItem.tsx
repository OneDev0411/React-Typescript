import { useMemo, useState } from 'react'

import {
  Button,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core'
import { useSelector } from 'react-redux'

import Link from 'components/ALink'
import { Avatar } from 'components/Avatar'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import MarketingTemplatePickerModal from 'components/MarketingTemplatePickers/MarketingTemplatePickerModal'
import { selectUser } from 'selectors/user'
import { eventTypesIcons } from 'views/utils/event-types-icons'

import CalendarListItemText from './CalendarListItemText'
import { getEventMarketingTemplateTypes } from './helpers'

interface Props {
  event: ICalendarEvent
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    listItemWithButton: {
      paddingRight: theme.spacing(12)
    },
    customizedAvatar: {
      backgroundColor: theme.palette.grey['200'],

      '& svg': {
        fill: theme.palette.common.black,
        color: theme.palette.common.black
      }
    }
  }),
  { name: 'CalendarEventListItem' }
)

export default function CalendarEventListItem({ event }: Props) {
  const classes = useStyles()
  const theme = useTheme()

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

  const avatarIcon = useMemo(() => {
    const Icon = eventTypesIcons[event.event_type]?.icon

    const eventIcon = (
      <Avatar
        className={classes.customizedAvatar}
        disableLazyLoad
        size="medium"
        contact={contact!}
        statusColor={theme.palette.grey[50]}
      >
        {Icon && <Icon />}
      </Avatar>
    )

    if (contact) {
      return <Link to={`/dashboard/contacts/${contact.id}`}>{eventIcon}</Link>
    }

    return eventIcon
  }, [classes, contact, event.event_type, theme])

  return (
    <>
      <ListItem classes={{ secondaryAction: classes.listItemWithButton }}>
        <ListItemAvatar>{avatarIcon}</ListItemAvatar>
        <CalendarListItemText event={event} />
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
