import React, { useContext } from 'react'
import { Box } from '@material-ui/core'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'
import { getTrimmedArrayAndOthersText } from 'utils/get-trimmed-array-and-others-text'
import IconAttachment from 'components/SvgIcons/Attachment/IconAttachment'
import { iconSizes } from 'components/SvgIcons/icon-sizes'

import { findInPeopleByEmail } from 'utils/find-in-people-by-email'

import { ListContext } from '../../context'
import { EventContainer } from '../components/EventContainer'
import styles from '../styles'
import { EventBadge } from '../components/EventBadge'
import { EmailRecipient } from '../../../../../EmailRecipient'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent<'full_thread'>
  nextItem: ICalendarListRow
}

export function EmailThread({ style, event, nextItem }: Props) {
  const { setSelectedEvent } = useContext(ListContext)
  const thread = event.full_thread

  const handleContainerClick = () => setSelectedEvent(event)

  const { visibleItems: recipients, othersText } = getTrimmedArrayAndOthersText(
    thread.recipients
  )

  return (
    <EventContainer
      style={style}
      event={event}
      nextItem={nextItem}
      icon={{
        color: eventIcons.Email.color,
        element: eventIcons.Email.icon
      }}
      title={
        <Box display="flex" alignItems="center">
          <a
            style={styles.link}
            onClick={e => {
              e.preventDefault()
              setSelectedEvent(event)
            }}
          >
            Email
          </a>
          &nbsp;
          {recipients.map((recipient, index) => {
            return (
              <React.Fragment key={index}>
                {index !== 0 && <>,&nbsp;</>}
                <EmailRecipient
                  recipient={recipient}
                  person={findInPeopleByEmail(event.people, recipient)}
                />
              </React.Fragment>
            )
          })}
          {othersText && (
            <>
              &nbsp;and&nbsp;<span>{othersText}</span>
            </>
          )}
          {thread.message_count > 1 && (
            <EventBadge>{thread.message_count}</EventBadge>
          )}
          {thread.has_attachments && (
            <EventBadge padding="dense">
              <IconAttachment size={iconSizes.small} />
            </EventBadge>
          )}
        </Box>
      }
      subtitle={<div>{event.title || 'No Subject'}</div>}
      onClick={handleContainerClick}
    />
  )
}
