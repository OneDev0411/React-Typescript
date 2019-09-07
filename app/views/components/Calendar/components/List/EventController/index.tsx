import React from 'react'

import { EditEmailDrawer } from 'components/EmailCompose/EditEmailDrawer'

import { CrmEvents } from '../../CrmEvents'

interface Props {
  event: ICalendarEvent | null
  user: IUser
  activeDate: Date | null
  onEventChange(event: IEvent, type: string): void
  onScheduledEmailChange(emailCampaign: IEmailCampaign): void
  onClose(): void
}

export function EventController({
  event,
  user,
  activeDate,
  onEventChange,
  onScheduledEmailChange,
  onClose
}: Props) {
  if (!event) {
    return null
  }

  if (event.object_type === 'crm_task') {
    return (
      <CrmEvents
        isEventDrawerOpen
        selectedDate={activeDate}
        event={event}
        user={user}
        onEventChange={onEventChange}
        onCloseEventDrawer={onClose}
      />
    )
  }

  if (event.object_type === 'email_campaign') {
    return (
      <EditEmailDrawer
        isOpen
        onClose={onClose}
        onEdited={emailCampaign => onScheduledEmailChange(emailCampaign)}
        emailId={event.campaign as UUID}
      />
    )
  }

  return null
}
