import React, { useContext } from 'react'

import { EditEmailDrawer } from 'components/EmailCompose'
import { EmailThreadModal } from 'components/EmailThreadModal'

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

  if (['crm_task', 'crm_association'].includes(event.object_type)) {
    return (
      <CrmEvents
        isEventDrawerOpen
        event={event}
        user={user}
        onEventChange={onEventChange}
        onCloseEventDrawer={() => setSelectedEvent(null)}
      />
    )
  }

  if (
    ['email_campaign', 'email_campaign_recipient'].includes(event.object_type)
  ) {
    return (
      <EditEmailDrawer
        isOpen
        emailId={event.campaign as UUID}
        onEdited={emailCampaign => onScheduledEmailChange(emailCampaign)}
        onClose={() => setSelectedEvent(null)}
      />
    )
  }

  if (event.object_type === 'email_thread_recipient') {
    return (
      <EmailThreadModal
        open={!!event.thread_key}
        onClose={() => setSelectedEvent(null)}
        threadKey={event.thread_key}
      />
    )
  }

  return null
}
