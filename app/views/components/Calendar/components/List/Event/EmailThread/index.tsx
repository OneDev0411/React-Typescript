import React, { useContext } from 'react'
import { Box, makeStyles } from '@material-ui/core'

import { useSelector } from 'react-redux'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'
import { getTrimmedArrayAndOthersText } from 'utils/get-trimmed-array-and-others-text'
import { findInPeopleByEmail } from 'utils/find-in-people-by-email'
import { getPersonDisplayName } from 'utils/get-person-display-name'
import IconAttachment from 'components/SvgIcons/Attachment/IconAttachment'
import { iconSizes } from 'components/SvgIcons/icon-sizes'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { hasOAuthAccess } from 'components/EmailThread/helpers/has-oauth-access'

import { IAppState } from 'reducers'

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
  const accounts: IOAuthAccount[] = useSelector((state: IAppState) =>
    selectAllConnectedAccounts(state.contacts.oAuthAccounts)
  )
  const thread = event.full_thread

  const handleContainerClick = () => setSelectedEvent(event)

  const { visibleItems: recipients, othersText } = getTrimmedArrayAndOthersText(
    thread.recipients
  )

  const isThreadRead = hasOAuthAccess(
    accounts,
    thread.google_credential || thread.microsoft_credential,
    'mail.modify'
  )
    ? thread.is_read
    : true

  return (
    <EventContainer
      style={style}
      event={event}
      Icon={eventIcons.Email.icon}
      editable={false}
      title={
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          style={{
            fontWeight: isThreadRead ? 400 : 600
          }}
        >
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
                {index !== 0 && (
                  <>
                    <span>,</span>
                    &nbsp;
                  </>
                )}
                <TextMiddleTruncate
                  text={displayName || recipient}
                  maxLength={othersText ? 20 : 30}
                  style={{
                    position: 'relative',
                    zIndex: 1
                  }}
                />
              </React.Fragment>
            )
          })}
          {othersText && (
            <>
              &nbsp;
              <span>and</span>
              &nbsp;
              <span>{othersText}</span>
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
