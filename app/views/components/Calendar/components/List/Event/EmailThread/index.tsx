import React, { useContext } from 'react'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'
import { getTrimmedArrayAndOthersText } from 'utils/get-trimmed-array-and-others-text'
import { parseEmailRecipient } from 'components/EmailRecipientsChipsInput/helpers/parse-email-recipient'
import MiniContactProfile from 'components/MiniContact/MiniContactProfile'

import { ListContext } from '../../context'
import { EventContainer } from '../components/EventContainer'
import styles from '../styles'
import { EventBadge } from '../components/EventBadge'
import IconAttachment from '../../../../../SvgIcons/Attachment/IconAttachment'
import { iconSizes } from '../../../../../SvgIcons/icon-sizes'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
  nextItem: ICalendarListRow
}

export function EmailThread({ style, event, nextItem }: Props) {
  const { setSelectedEvent } = useContext(ListContext)
  const thread = event.full_thread

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
        <div>
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
                  <span>{displayName || emailAddress}</span>
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
        </div>
      }
      subtitle={<div>{event.title || 'No Subject'}</div>}
    />
  )
}
