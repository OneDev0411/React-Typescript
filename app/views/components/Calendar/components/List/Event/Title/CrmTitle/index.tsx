import React, { MouseEvent, memo } from 'react'

import styles from '../../styles'

import { CrmStatus } from '../../../../CrmStatus'
import { Associations } from './Associations'

interface Props {
  event: ICalendarEvent
  onClickCrmEventAssociations(event: ICalendarEvent): void
  onEventChange(event: IEvent, type: 'updated'): void
}

const CrmEvent = memo(
  ({ event, onClickCrmEventAssociations, onEventChange }: Props) => {
    const handleSelectEvent = (e: MouseEvent<HTMLElement>) => {
      e.preventDefault()

      onClickCrmEventAssociations(event)
    }

    return (
      <div style={styles.title}>
        {event.status && new Date(event.timestamp * 1000) > new Date() && (
          <CrmStatus event={event} onChange={onEventChange} />
        )}
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
  }
)

export default CrmEvent
