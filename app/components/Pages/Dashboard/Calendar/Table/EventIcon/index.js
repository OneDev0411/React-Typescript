import React from 'react'

import { eventTypesIcons } from '../../../../../../views/utils/event-types-icons'
import { importantDatesIcons } from '../../../../../../views/utils/important-dates-icons'

const getIcon = Icon => (
  <Icon.icon
    style={{
      marginRight: '1rem',
      marginTop: '5px'
    }}
    fill={Icon.color}
  />
)

const getImportantDateIcon = event => {
  console.log('event', event)

  const { type_label: label, event_type: type } = event

  if (importantDatesIcons[label]) {
    return importantDatesIcons[label]
  }

  // Child or spouse birthdays
  // Todo: Refactor icons and related stuff
  if (type === 'birthday' || type === 'child_birthday') {
    return importantDatesIcons.Birthday
  }

  return eventTypesIcons['Task Critical']
}

const getCrmTaskIcon = type => {
  if (eventTypesIcons[type]) {
    return eventTypesIcons[type]
  }

  if (type === 'Message') {
    return eventTypesIcons.Mail
  }

  return eventTypesIcons['Task Critical']
}

const EventIcon = ({ event }) => {
  let icon

  switch (event.object_type) {
    case 'deal_context':
      icon = eventTypesIcons['Task Critical']
      break
    case 'crm_task':
      icon = getCrmTaskIcon(event.event_type)
      break

    case 'contact_attribute':
      icon = getImportantDateIcon(event)
      break

    default:
      icon = eventTypesIcons['Task Critical']
  }

  return getIcon(icon)
}

export default EventIcon
