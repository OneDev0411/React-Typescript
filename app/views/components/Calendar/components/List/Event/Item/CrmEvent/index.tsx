import React, { MouseEvent, memo } from 'react'

import { EventIcon } from '../EventIcon'

import styles from '../styles'
import { Associations } from './Associations'

interface StateProps {
  user: IUser
}

interface Props {
  user?: IUser
  event: ICalendarEvent
  onClickCrmEventAssociations(event: ICalendarEvent): void
}

const CrmEvent = memo((props: Props) => {
  const handleSelectEvent = (e: MouseEvent<HTMLElement>) =>
    props.onClickCrmEventAssociations(props.event)

  return (
    <div onClick={handleSelectEvent}>
      <div style={styles.container}>
        <EventIcon event={props.event} />

        <div style={styles.title}>
          {props.event.event_type}{' '}
          {getCrmEventTypePreposition(props.event.event_type)}{' '}
          <Associations
            event={props.event}
            onClickAssociation={handleSelectEvent}
          />
        </div>
      </div>

      {props.event.event_type === 'Email' && (
        <div style={styles.subtitle}>{props.event.title}</div>
      )}
    </div>
  )
})

function getCrmEventTypePreposition(eventType: string): string {
  switch (eventType) {
    case 'Chat':
    case 'Call':
    case 'In-Person Meeting':
    case 'Other':
      return 'with'

    case 'Mail':
    case 'Email':
    case 'Text':
      return 'to'

    default:
      return ''
  }
}

export default CrmEvent
