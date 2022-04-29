import { useMemo, useState } from 'react'

import {
  Button,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar as MuiAvatar,
  withStyles,
  makeStyles,
  Theme
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
  { name: 'CalendarEventListItem' }
)

export default function CalendarEventListItem({ event }: Props) {
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

  const avatarIcon = useMemo(() => {
    const Icon = eventTypesIcons[event.event_type]?.icon

    return Icon ? (
      <CustomizedMuiAvatar>
        <Icon />
      </CustomizedMuiAvatar>
    ) : (
      <CustomizedMuiAvatar />
    )
  }, [event.event_type])

  const contactAvatarIcon = useMemo(
    () =>
      contact && (
        <Link to={`/dashboard/contacts/${contact.id}`}>
          <Avatar
            disableLazyLoad
            size="medium"
            contact={contact}
            statusColor={`${(theme: Theme) => theme.palette.grey[50]}`}
          >
            {avatarIcon}
          </Avatar>
        </Link>
      ),
    [avatarIcon, contact]
  )

  return (
    <>
      <ListItem classes={{ secondaryAction: classes.listItemWithButton }}>
        <ListItemAvatar>{contactAvatarIcon || avatarIcon}</ListItemAvatar>
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
