import { TRIGGERABLE_ATTRIBUTES } from '../constants'
import { getTriggerSubject } from '../TriggerEditMode/helpers/get-trigger-subject'

import { getValue } from '.'

/**
 * return the all state related to the trigger edit value
 * @param {ITrigger} trigger - current trigger
 * @param {Nullable<IGlobalTrigger>} globalTrigger - the global trigger is set for the attr
 * @param {IContact} contact - current contact
 * @param {IContactAttribute} attribute - editing attribute
 */
interface TriggerState {
  currentTrigger: Nullable<ITrigger>
  isTriggerActive: boolean
  triggerSender: IUser
  triggerSubject: string
  triggerSendBefore: number
  triggerSelectedTemplate: null
}

export function getStateFromTrigger(
  trigger: ITrigger,
  globalTrigger: Nullable<IGlobalTrigger>,
  contact: IContact,
  attribute: IContactAttribute
): TriggerState {
  const attributeName = (attribute.attribute_def.name ??
    '') as TriggerContactEventTypes

  if (globalTrigger) {
    return {
      currentTrigger: null,
      isTriggerActive: true,
      triggerSender: contact.user as IUser,
      triggerSubject: globalTrigger.subject,
      triggerSendBefore: globalTrigger.wait_for ?? 0,
      triggerSelectedTemplate: null
    }
  }

  if (trigger) {
    return {
      currentTrigger: trigger,
      isTriggerActive: true,
      triggerSender: (trigger.campaign?.from as IUser) ?? contact.user,
      triggerSubject:
        trigger.campaign?.subject || getTriggerSubject(attributeName),
      triggerSendBefore: trigger.wait_for || 0,
      triggerSelectedTemplate: null
    }
  }

  // we're checking if date value is already exist
  // disable the trigger unless enable it
  let isActive

  if (attribute && TRIGGERABLE_ATTRIBUTES.includes(attributeName)) {
    const attributeValue = getValue(attribute)

    if (
      typeof attributeValue === 'object' &&
      (!attributeValue.year ||
        !attributeValue.month?.value ||
        !attributeValue.day?.value)
    ) {
      isActive = true
    } else {
      isActive = false
    }
  }

  return {
    currentTrigger: null,
    isTriggerActive: isActive,
    triggerSender: contact.user as IUser,
    triggerSubject: getTriggerSubject(attributeName),
    triggerSendBefore: 0,
    triggerSelectedTemplate: null
  }
}
