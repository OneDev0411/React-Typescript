/**
 * return the contact triggers
 * @param {ITriggeredContact} contact - all attributes definitions
 */

export const getContactTriggers = (contact: ITriggeredContact): any => {
  if (!contact || !contact.triggers) {
    return {}
  }

  let triggers = {}

  contact.triggers.forEach((trigger: ITrigger) => {
    if (trigger.action === 'schedule_email') {
      triggers[trigger.event_type] = trigger
    }
  })

  return triggers
}
