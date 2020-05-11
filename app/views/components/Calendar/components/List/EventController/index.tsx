import React, { useContext } from 'react'

import { EditEmailDrawer } from 'components/EmailCompose'

import { ListContext } from '../context'

import { CrmEvents } from '../../CrmEvents'
import {
  EmailThreadDrawerByThreadKey,
  EmailCampaignThreadByCampaignId
} from '../../../../EmailThreadDrawer'

interface Props {
  user: IUser
  onEventChange(event: IEvent, type: string): void
  onScheduledEmailChange(emailCampaign: IEmailCampaign): void
}

export function EventController({
  user,
  onEventChange,
  onScheduledEmailChange
}: Props) {
  const { selectedEvent: event, setSelectedEvent, contact } = useContext(
    ListContext
  )

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

  const isEmail =
    event &&
    ['email_campaign', 'email_campaign_recipient'].includes(event.object_type)

  const isScheduledEmail =
    isEmail &&
    event!.event_type === 'scheduled_email' &&
    event!.timestamp * 1000 > Date.now()
  const isExecutedEmail = isEmail && event!.event_type === 'executed_email'

  const editEmailDrawer = isScheduledEmail ? (
    <EditEmailDrawer
      isOpen
      emailId={event!.campaign as UUID}
      onEdited={emailCampaign => onScheduledEmailChange(emailCampaign)}
      onClose={() => setSelectedEvent(null)}
    />
  ) : null

  const emailThreadDrawer = (
    <EmailThreadDrawerByThreadKey
      open={!!(event && event.object_type === 'email_thread_recipient')}
      onClose={() => setSelectedEvent(null)}
      threadKey={(event && event.thread_key) || undefined}
    />
  )

  const emailCampaignThreadDrawer = (
    <EmailCampaignThreadByCampaignId
      open={!!isExecutedEmail}
      onClose={() => setSelectedEvent(null)}
      contactId={contact && contact.id}
      campaignId={(event && event.campaign) || undefined}
    />
  )

  return (
    <>
      {editEmailDrawer}
      {eventDrawer}
      {emailThreadDrawer}
      {emailCampaignThreadDrawer}
    </>
  )
}
