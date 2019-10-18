import React, { useContext } from 'react'
import { Box } from '@material-ui/core'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'
import { getTrimmedArrayAndOthersText } from 'utils/get-trimmed-array-and-others-text'
import { parseEmailRecipient } from 'components/EmailRecipientsChipsInput/helpers/parse-email-recipient'
import MiniContactProfile from 'components/MiniContact/MiniContactProfile'
import IconAttachment from 'components/SvgIcons/Attachment/IconAttachment'
import { iconSizes } from 'components/SvgIcons/icon-sizes'

import { ListContext } from '../../context'
import { EventContainer } from '../components/EventContainer'
import styles from '../styles'
import { EventBadge } from '../components/EventBadge'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
  nextItem: ICalendarListRow
}

export function EmailThread({ style, event, nextItem }: Props) {
  const { setSelectedEvent } = useContext(ListContext)
  const thread = event.full_thread! // FIXME(NOW)

  const handleContainerClick = () => setSelectedEvent(event)

  const { visibleItems: recipients, othersText } = getTrimmedArrayAndOthersText(
    thread.to
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
          &nbsp;to&nbsp;
          {recipients.map((recipient, index) => {
            const { displayName, emailAddress } = parseEmailRecipient(recipient)

            return (
              <React.Fragment key={index}>
                {index !== 0 && <>,&nbsp;</>}
                <MiniContactProfile
                  as="span"
                  data={{
                    email_address: emailAddress,
                    display_name:
                      displayName !== emailAddress ? displayName : undefined
                  }}
                  type="insight"
                >
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    {displayName || emailAddress}
                  </span>
                </MiniContactProfile>
              </React.Fragment>
            )
          })}
          {othersText && (
            <>
              &nbsp;and <span>{othersText}</span>
            </>
          )}
          {thread.email_count > 1 && (
            <EventBadge>{thread.email_count}</EventBadge>
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
