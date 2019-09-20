import React, { MouseEvent, memo, useContext } from 'react'

import { ListContext } from '../../../context'

import styles from '../../styles'

import { Associations } from './Associations'

interface Props {
  event: ICalendarEvent
}

const CrmEvent = memo(({ event }: Props) => {
  const { setSelectedEvent } = useContext(ListContext)

  const handleSelectEvent = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setSelectedEvent(event)
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
      <Associations event={event} />
    </div>
  )
})

export default CrmEvent
