import { convertSecondsToDay } from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/TriggerEditMode/helpers'

/**
 * generate initial valued for global trigger form
 * @param trigger
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
