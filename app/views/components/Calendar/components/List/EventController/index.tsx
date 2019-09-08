import React, { useContext } from 'react'

import { EditEmailDrawer } from 'components/EmailCompose/EditEmailDrawer'

import { ListContext } from '../context'

import { CrmEvents } from '../../CrmEvents'

interface Props {
  user: IUser
  activeDate: Date | null
  onEventChange(event: IEvent, type: string): void
  onScheduledEmailChange(emailCampaign: IEmailCampaign): void
}

export function EventController({
  user,
  activeDate,
  onEventChange,
  onScheduledEmailChange
}: Props) {
  const { selectedEvent: event, setSelectedEvent } = useContext(ListContext)

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
        onCloseEventDrawer={() => setSelectedEvent(null)}
      />
    )
  }

  if (event.object_type === 'email_campaign') {
    return (
      <EditEmailDrawer
        isOpen
        emailId={event.campaign as UUID}
        onEdited={emailCampaign => onScheduledEmailChange(emailCampaign)}
        onClose={() => setSelectedEvent(null)}
      />
    )
  }

  return null
}
