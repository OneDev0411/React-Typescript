import React, { useContext } from 'react'

import MiniContactProfile from 'components/MiniContact'

import { getTrimmedArrayAndOthersText } from 'utils/get-trimmed-array-and-others-text'

import { ListContext } from '../../../context'

import styles from './styles'

interface Props {
  event: ICalendarEvent
}

export function Associations({ event }: Props) {
  const { setSelectedEvent } = useContext(ListContext)

  if (!event.people) {
    return null
  }

  const preposition = getCrmEventTypePreposition(event.event_type)

  const { visibleItems: contacts, othersText } = getTrimmedArrayAndOthersText(
    event.people,
    { threshold: 2, totalCount: event.people_len }
  )

  return (
    <span>
      {preposition}{' '}
      {contacts.map((item, index) => (
        <React.Fragment key={index}>
          {index !== 0 && <>,&nbsp;</>}
          <MiniContactProfile as="span" data={item} type="event">
            <a
              onClick={e => e.stopPropagation()}
              target="_blank"
              href={`/dashboard/contacts/${item.id}`}
            >
              {item.display_name}
            </a>
          </MiniContactProfile>
        </React.Fragment>
      ))}
      {othersText && (
        <>
          {' and '}
          <span
            style={styles.association}
            onClick={() => setSelectedEvent(event)}
          >
            {othersText}
          </span>
        </>
      )}
    </span>
  )
}

function getCrmEventTypePreposition(eventType: string): string {
  switch (eventType) {
    case 'Chat':
    case 'Call':
    case 'Tour':
    case 'In-Person Meeting':
    case 'Other':
      return 'with'

    case 'Mail':
    case 'Email':
    case 'Text':
      return 'to'

    case 'Open House':
    case 'Note':
      return 'for'

    default:
      return ''
  }
}
