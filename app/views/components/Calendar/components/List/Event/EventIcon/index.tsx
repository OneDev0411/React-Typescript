import React from 'react'

import { eventTypesIcons } from 'views/utils/event-types-icons'
import { importantDatesIcons } from 'views/utils/important-dates-icons'

import { hexToRgb } from 'utils/hex-to-rgb'

import styles from './styles'

interface Props {
  event: ICalendarEvent
}

export function EventIcon(props: Props) {
  let Icon = eventTypesIcons['Task Critical']

  if (['crm_task', 'crm_association'].includes(props.event.object_type)) {
    Icon = getCrmTaskIcon(props.event)
  }

  if (props.event.object_type === 'contact_attribute') {
    Icon = getImportantDateIcon(props.event)
  }

  if (
    ['email_campaign', 'email_campaign_recipient'].includes(
      props.event.object_type
    )
  ) {
    Icon = eventTypesIcons.Email
  }

  if (
    props.event.object_type === 'contact' &&
    props.event.event_type === 'next_touch'
  ) {
    Icon = eventTypesIcons.TouchDate
  }

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: `rgba(
        ${hexToRgb(Icon.color).join(', ')},
        0.2
      )`
      }}
    >
      <Icon.icon
        fill={Icon.color}
        style={{ width: '1.2rem', height: '1.2rem' }}
      />
    </div>
  )
}

/**
 * finds and returns contact attributes icon
 */
function getImportantDateIcon(event: ICalendarEvent) {
  const { type_label: label, event_type: type } = event

  if (importantDatesIcons[label]) {
    return importantDatesIcons[label]
  }

  if (type === 'birthday' || type === 'child_birthday') {
    return importantDatesIcons.Birthday
  }

  return eventTypesIcons['Task Critical']
}

/**
 * finds and returns crm event icons
 */
function getCrmTaskIcon(event: ICalendarEvent) {
  if (eventTypesIcons[event.event_type]) {
    return eventTypesIcons[event.event_type]
  }

  if (event.event_type === 'Message') {
    return eventTypesIcons.Mail
  }

  return eventTypesIcons['Task Critical']
}
