import { convertSecondsToDay } from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/TriggerEditMode/helpers'

/**
 * generate initial valued for global trigger form
 * @param {IGlobalTrigger} trigger - current trigger
 */
export const generateInitialValues = (
  trigger?: IGlobalTrigger
): IGlobalTriggerFormData => {
  if (trigger) {
    const template: IGlobalTriggerFormData['template'] = trigger.template
      ? {
          isInstance: false,
          id: trigger.template.id
        }
      : {
          isInstance: true,
          id: trigger.template_instance!.id
        }

    return {
      subject: trigger.subject,
      wait_for: convertSecondsToDay(trigger.wait_for),
      template
    }
  }

  return {
    subject: 'Hi',
    wait_for: 0
  }
}

/**
 * generate the payload we send to the server
 * @param {IGlobalTriggerFormData} data - form's data
 * @param {UUID} brand - active brand id
 * @param {TriggerContactEventTypes} eventType - the type we want to create/edit trigger
 */
export const generatePayload = (
  data: IGlobalTriggerFormData,
  brand: UUID,
  eventType: TriggerContactEventTypes
): IGlobalTriggerInput => {
  const { template, wait_for, ...restData } = data

  const selectedTepmlate = template?.isInstance
    ? {
        template_instance: template.id
      }
    : {
        template: template!.id
      }

  // -86400 number of millisecond of a day
  const waitFor = Math.abs(Number(wait_for)) * -86400

  return {
    brand,
    wait_for: waitFor,
    event_type: eventType,
    ...selectedTepmlate,
    ...restData
  }
}
