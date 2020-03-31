import React, { useContext } from 'react'
import { Box, makeStyles } from '@material-ui/core'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'
import { getTrimmedArrayAndOthersText } from 'utils/get-trimmed-array-and-others-text'
import IconAttachment from 'components/SvgIcons/Attachment/IconAttachment'
import { iconSizes } from 'components/SvgIcons/icon-sizes'

import { findInPeopleByEmail } from 'utils/find-in-people-by-email'
import { getPersonDisplayName } from 'utils/get-person-display-name'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { ListContext } from '../../context'
import { EventContainer } from '../components/EventContainer'
import { sharedStyles } from '../styles'
import { EventBadge } from '../components/EventBadge'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent<'full_thread'>
}

const useStyles = makeStyles(sharedStyles)

export function EmailThread({ style, event }: Props) {
  const classes = useStyles({})
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
      Icon={eventIcons.Email.icon}
      editable={false}
      title={
        <Box display="flex" alignItems="center">
          <a
            className={classes.link}
            onClick={e => {
              e.preventDefault()
              setSelectedEvent(event)
            }}
          >
            <TextMiddleTruncate text={event.title} maxLength={40} />
          </a>
          <span className={classes.splitter}>—</span>
          {recipients.map((recipient, index) => {
            const person = findInPeopleByEmail(event.people, recipient)
            const displayName = getPersonDisplayName(person)

            return (
              <React.Fragment key={index}>
                {index !== 0 && <>,&nbsp;</>}
                {displayName || recipient}
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
      onClick={handleContainerClick}
    />
  )
}
