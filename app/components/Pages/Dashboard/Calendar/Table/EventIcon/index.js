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

const getImportantDateIcon = label => {
  if (importantDatesIcons[label]) {
    return importantDatesIcons[label]
  }

  return eventTypesIcons['Task Critical']
}

const getCrmTaskIcon = type => {
  if (eventTypesIcons[type]) {
    return eventTypesIcons[type]
  } else if (type === 'Message') {
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
      icon = getImportantDateIcon(event.type_label)
      break

    default:
      icon = eventTypesIcons['Task Critical']
  }

  return getIcon(icon)
}

export default EventIcon
