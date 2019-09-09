import React, { MouseEvent, memo, useContext } from 'react'

import { ListContext } from '../../../context'

import styles from '../../styles'

import { CrmStatus } from '../../../../CrmStatus'
import { Associations } from './Associations'

interface Props {
  event: ICalendarEvent
  onEventChange(event: IEvent, type: 'updated'): void
}

const CrmEvent = memo(({ event, onEventChange }: Props) => {
  const { setSelectedEvent } = useContext(ListContext)

  const handleSelectEvent = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setSelectedEvent(event)
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
      <Associations event={event} />
    </div>
  )
})

export default CrmEvent
