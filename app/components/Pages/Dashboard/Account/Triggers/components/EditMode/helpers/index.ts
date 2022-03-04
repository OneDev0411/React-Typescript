import { convertSecondsToDay } from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/TriggerEditMode/helpers'
import { createTemplateInstance } from '@app/models/instant-marketing/triggers/helpers'
import { getUserWithOnBehalfVariable } from '@app/utils/marketing-center/get-user-with-on-behalf-variable'

import { getAttributeName } from '../../Items/components/helpers'

/**
 * generate initial valued for global trigger form
 * @param {IGlobalTrigger} trigger - current trigger
 */
export const generateInitialValues = (
  trigger: Optional<IGlobalTrigger<'template' | 'template_instance'>>,
  eventType: Optional<TriggerContactEventTypes>
): IGlobalTriggerFormData => {
  if (trigger) {
    return {
      subject: trigger.subject,
      template: trigger.template_instance ?? trigger.template,
      wait_for: convertSecondsToDay(trigger.wait_for)
    }
  }

  return {
    subject: eventType
      ? `Happy ${getAttributeName(eventType)}`
      : 'Celebration!',
    wait_for: 0,
    template: null
  }
}

/**
 * generate the payload we send to the server
 * @param {IGlobalTriggerFormData} data - form's data
 * @param {IBrand} brand - active brand
 * @param {IUser} user - active user
 * @param {TriggerContactEventTypes} eventType - the type we want to create/edit trigger
 */
export const generatePayload = async (
  data: IGlobalTriggerFormData,
  brand: IBrand,
  user: IUser,
  eventType: TriggerContactEventTypes
): Promise<IGlobalTriggerInput> => {
  const { template, wait_for, ...restData } = data

  /*
    here we're changing the functionality of accepting brand templates
    and creating an instance in selecting a brand template,
    but due to some caution I don't change the base code of it.
  */
  const templateInstance =
    template?.type === 'template_instance'
      ? template
      : await createTemplateInstance(template!, brand, {
          user: getUserWithOnBehalfVariable(user)
        })

  // -86400 number of millisecond of a day
  const waitFor = Math.abs(Number(wait_for)) * -86400

  return {
    brand: brand.id,
    wait_for: waitFor,
    event_type: eventType,
    template_instance: templateInstance.id,
    ...restData
  }
}
