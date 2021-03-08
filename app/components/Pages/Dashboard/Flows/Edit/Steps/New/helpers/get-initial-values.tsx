import {
  BaseFormData,
  EventFormData,
  MarketingEmailFormData,
  BasicEmailFormData
} from '../types'
import { defaultWaitForValue } from '../components/BaseFields/WaitFor/Fields'
import { convertToWebInput as convertWaitForToWebInput } from '../components/BaseFields/WaitFor/helpers'
import { getInitialTemplateValue } from '../MarketingEmailForm/helpers'

/**
 * return the basic initial value of form
 * @param {IBrandFlowStep} step - current step
 */
const getBasicInitialValues = (
  step?: Nullable<IBrandFlowStep>
): BaseFormData => {
  if (!step) {
    return {
      title: '',
      wait_for: defaultWaitForValue,
      time: '08:00:00',
      event_type: ''
    }
  }

  return {
    title: step.title,
    description: step.description,
    wait_for: convertWaitForToWebInput(step.wait_for),
    event_type: step.event_type,
    time: step.time
  }
}

/**
 * return the initial value of event step form
 * @param {IBrandFlowStep} step - current step
 */
export const getEventInitialValues = (
  step?: Nullable<IBrandFlowStep>
): EventFormData => {
  const baseFields = getBasicInitialValues(step)
  const specificFields =
    step && step.event
      ? {
          task_type: {
            value: step.event.task_type,
            title: step.event.task_type
          }
        }
      : {
          task_type: {
            value: 'Call',
            title: 'Call'
          }
        }

  // @ts-ignore
  return {
    ...baseFields,
    ...specificFields
  }
}

/**
 * return the initial value of marketing email step form
 * @param {IBrandFlowStep} step - current step
 */
export const getMarketingEmailInitialValues = (
  step?: Nullable<IBrandFlowStep>
): MarketingEmailFormData => {
  const baseFields = getBasicInitialValues(step)
  const specificFields = step
    ? {
        template: getInitialTemplateValue(step)
      }
    : { template: null }

  return {
    ...baseFields,
    ...specificFields
  }
}

/**
 * return the initial value of basic email step form
 * @param {IBrandFlowStep} step - current step
 */
export const getBasicEmailInitialValues = (
  step?: Nullable<IBrandFlowStep>,
  defaultTemplate?: UUID
): BasicEmailFormData => {
  const baseFields = getBasicInitialValues(step)
  const specificFields =
    step && step.email
      ? {
          email_template: defaultTemplate || step.email.id
        }
      : { email_template: defaultTemplate || '' }

  return {
    ...baseFields,
    ...specificFields
  }
}
