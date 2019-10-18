import React, { useContext } from 'react'

import { EditEmailDrawer } from 'components/EmailCompose'

import { EmailThreadDrawer } from 'components/EmailThreadDrawer'

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

  const eventDrawer =
    event && ['crm_task', 'crm_association'].includes(event.object_type) ? (
      <CrmEvents
        isEventDrawerOpen
        event={event}
        user={user}
        onEventChange={onEventChange}
        onCloseEventDrawer={() => setSelectedEvent(null)}
      />
    ) : null

  const editEmailDrawer =
    event &&
    ['email_campaign', 'email_campaign_recipient'].includes(
      event.object_type
    ) ? (
      <EditEmailDrawer
        isOpen
        emailId={event.campaign as UUID}
        onEdited={emailCampaign => onScheduledEmailChange(emailCampaign)}
        onClose={() => setSelectedEvent(null)}
      />
    ) : null

  const emailThreadDrawer = (
    <EmailThreadDrawer
      open={!!(event && event.object_type === 'email_thread_recipient')}
      onClose={() => setSelectedEvent(null)}
      threadKey={event && event.thread_key}
    />
  )

  return (
    <>
      {editEmailDrawer}
      {eventDrawer}
      {emailThreadDrawer}
    </>
  )
}
