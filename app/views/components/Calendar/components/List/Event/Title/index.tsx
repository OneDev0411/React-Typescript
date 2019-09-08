import React from 'react'

import MiniContactProfile from 'components/MiniContact'

import CrmTitle from './CrmTitle'
import styles from '../styles'

interface Props {
  event: ICalendarEvent
  onClickScheduledEmail(event: ICalendarEvent): void
  onClickCrmEventAssociations(event: ICalendarEvent): void
  onEventChange(event: IEvent, type: 'updated'): void
}

export function EventTitle(props: Props) {
  const { event } = props

  if (['crm_task', 'crm_association'].includes(event.object_type)) {
    return (
      <CrmTitle
        event={event}
        onClickCrmEventAssociations={props.onClickCrmEventAssociations}
        onEventChange={props.onEventChange}
      />
    )
  }

  if (event.object_type === 'contact_attribute') {
    return (
      <div style={styles.title}>
        <MiniContactProfile
          type="event"
          data={event.full_contact as IContact}
          as="span"
        >
          <a href={`/dashboard/contacts/${event.contact}`} target="_blank">
            {event.full_contact!.display_name}
          </a>
        </MiniContactProfile>
        's {event.event_type}
      </div>
    )
  }

  if (event.object_type === 'deal_context') {
    return (
      <div style={styles.title}>
        {event.type_label} for{' '}
        <a href={`/dashboard/deals/${event.deal}`} target="_blank">
          {event.title}
        </a>
      </div>
    )
  }

  if (event.object_type === 'contact' && event.event_type === 'next_touch') {
    return (
      <div style={styles.title}>
        Contact{' '}
        <MiniContactProfile
          type="event"
          data={event.full_contact as IContact}
          as="span"
        >
          <a href={`/dashboard/contacts/${event.contact}`} target="_blank">
            {event.full_contact!.display_name}
          </a>
        </MiniContactProfile>
      </div>
    )
  }

  if (
    ['email_campaign', 'email_campaign_recipient'].includes(
      event.object_type
    ) &&
    event.event_type === 'scheduled_email'
  ) {
    return (
      <div style={styles.title}>
        <a
          style={styles.link}
          onClick={e => {
            e.preventDefault()
            props.onClickScheduledEmail(event)
          }}
        >
          {event.title || 'No Subject'}
        </a>
      </div>
    )
  }

  console.warn(`Could not render ${event}`)

  return null
}
