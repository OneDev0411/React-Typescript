import React from 'react'
import styled from 'styled-components'

const Image = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 12px;
`

const getIcon = name => (
  <Image src={`/static/images/calendar/${name}.svg`} alt="" />
)

const getImportantDateIcon = label => {
  switch (label.toLowerCase()) {
    case 'birthday':
      return getIcon('important-date__birthday')

    case 'graduation anniversary':
      return getIcon('important-date__graduation-anniversary')

    case 'new home':
      return getIcon('important-date__new-home')

    case 'work anniversary':
      return getIcon('important-date__work-anniversary')

    case 'wedding anniversary':
      return getIcon('important-date__wedding-anniversary')

    case 'child':
      return getIcon('important-date__child')

    case 'pet':
      return getIcon('important-date__pet')

    default:
      return getIcon('default')
  }
}

const getCrmTaskIcon = type => {
  switch (type.toLowerCase()) {
    case 'open house':
      return getIcon('task__open-house')

    case 'call':
      return getIcon('task__call')

    case 'closing':
      return getIcon('task__closing')

    case 'message':
      return getIcon('task__message')

    case 'follow up':
    case 'todo':
      return getIcon('task__followup')

    case 'tour':
      return getIcon('task__tour')

    case 'listing appointment':
      return getIcon('task__listing-appointment')

    default:
      return getIcon('default')
  }
}

const EventIcon = ({ event }) => {
  switch (event.object_type) {
    case 'deal_context':
      return getIcon('default')

    case 'crm_task':
      return getCrmTaskIcon(event.event_type)

    case 'contact_attribute':
      return getImportantDateIcon(event.type_label)

    default:
      return getIcon('default')
  }
}

export default EventIcon
