import { TriggerDataInput } from 'models/instant-marketing/triggers/types'

interface Input extends TriggerDataInput {
  template: IMarketingTemplateInstance
}

/**
 * validate trigger field
 * @param {Input} trigger - all attributes definitions
 */

export const validateTriggerFields = (
  trigger: Input,
  current: ITrigger
): string => {
  if (!trigger) {
    return 'Something wend wrong!'
  }

  if (!current && !trigger.template) {
    return 'Select a Template'
  }

  if (!('wait_for' in trigger) || trigger.wait_for > 0) {
    return 'Invalid Deliver in Value'
  }

  if (!trigger.subject) {
    return 'Subject not Provided'
  }

  if (!trigger.event_type) {
    return 'Event Type not Provided'
  }

  return ''
}
