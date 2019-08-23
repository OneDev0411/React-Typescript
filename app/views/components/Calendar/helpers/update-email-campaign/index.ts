/**
 * @param events - list of calendar events
 * @param event - the specific event
 * @param emailCampaign - the email campaign object
 */
export function updateEmailCampaign(
  events: ICalendarEvent[],
  event: ICalendarEvent,
  emailCampaign: IEmailCampaign
) {
  return events.map(item =>
    item.campaign === emailCampaign.id
      ? {
          ...event,
          timestamp: emailCampaign.due_at,
          title: emailCampaign.subject
        }
      : event
  )
}
