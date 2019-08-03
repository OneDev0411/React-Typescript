import React from 'react'

import { eventTypesIcons } from 'views/utils/event-types-icons'
import { importantDatesIcons } from 'views/utils/important-dates-icons'

import { Container } from './styled'

interface Props {
  event: ICalendarEvent
}

export function EventIcon(props: Props) {
  let Icon = eventTypesIcons['Task Critical']

  if (props.event.object_type === 'crm_task') {
    Icon = getCrmTaskIcon(props.event)
  }

  if (props.event.object_type === 'contact_attribute') {
    Icon = getImportantDateIcon(props.event)
  }

  return (
    <Container backgroundColor={Icon.color}>
      <Icon.icon fill={Icon.color} style={{ width: '1rem', height: '1rem' }} />
    </Container>
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
