import React, { MouseEvent, memo } from 'react'

import styles from '../../styles'
import { Associations } from './Associations'

interface Props {
  event: ICalendarEvent
  onClickCrmEventAssociations(event: ICalendarEvent): void
}

const CrmEvent = memo(({ event, onClickCrmEventAssociations }: Props) => {
  const handleSelectEvent = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    onClickCrmEventAssociations(event)
  }

  return (
    <div style={styles.title}>
      <a
        onClick={handleSelectEvent}
        style={{
          cursor: 'pointer'
        }}
      >
        {event.event_type}
      </a>{' '}
      <Associations event={event} onClickAssociation={handleSelectEvent} />
    </div>
  )
})

export default CrmEvent
