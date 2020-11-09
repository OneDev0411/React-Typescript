/**
 * return the attribute trigger
 * @param {ITriggeredContact} contact - all attributes definitions
 */

export const getScheduleEmailTrigger = (
  contact: ITriggeredContact,
  eventType: TriggerContactEventTypes
): ITrigger | null => {
  if (!contact || !contact.triggers) {
    return null
  }

  const trigger = contact.triggers.find(
    trigger =>
      trigger.event_type === eventType && trigger.action === 'schedule_email'
  )

  return trigger ?? null
}
