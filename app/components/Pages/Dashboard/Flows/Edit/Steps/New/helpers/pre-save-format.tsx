import { convertToServerInput } from '../components/BaseFields/WaitFor/helpers'

import {
  BaseFormData,
  EventFormData,
  MarketingEmailFormData,
  BasicEmailFormData
} from '../types'

/**
 * return the formatted data for the event form
 * @param {number} order - current order
 * @param {BaseFormData} data - basic current data
 * @param {IBrandFlowStep} step - current step
 */
const basicPreSaveFormat = (
  order: number,
  data: BaseFormData,
  step?: Nullable<IBrandFlowStep>
): IBaseBrandFlowStep => {
  return {
    order: step ? step.order : order,
    title: data.title,
    description: data.description,
    event_type: data.event_type,
    time: data.time,
    wait_for: convertToServerInput(data.wait_for)
  }
}

/**
 * return the formatted data for the event form
 * @param {number} order - current order
 * @param {EventFormData} data - current data
 * @param {IBrandFlowStep} step - current step
 */
export const eventFormPreSaveFormat = (
  order: number,
  data: EventFormData,
  step?: Nullable<IBrandFlowStep>
): IBrandFlowStepInput => {
  const baseData = basicPreSaveFormat(order, data, step)

  return {
    ...baseData,
    event: {
      title: data.title,
      description: data.task_type.value,
      task_type: data.task_type.value
    }
  }
}

/**
 * return the formatted data for the marketing email form
 * @param {number} order - current order
 * @param {EventFormData} data - current data
 * @param {IBrandFlowStep} step - current step
 */
export const marketingEmailFormPreSaveFormat = (
  order: number,
  data: MarketingEmailFormData,
  step?: Nullable<IBrandFlowStep>
): IBrandFlowStepInput => {
  const baseData = basicPreSaveFormat(order, data, step)
  const template = data.template?.isInstance
    ? { template_instance: data.template?.id }
    : { template: data.template?.id }

  return {
    ...baseData,
    ...template
  }
}

/**
 * return the formatted data for the basic email form
 * @param {number} order - current order
 * @param {EventFormData} data - current data
 * @param {IBrandFlowStep} step - current step
 */
export const basicEmailFormPreSaveFormat = (
  order: number,
  data: BasicEmailFormData,
  step?: Nullable<IBrandFlowStep>
): IBrandFlowStepInput => {
  const baseData = basicPreSaveFormat(order, data, step)

  return {
    ...baseData,
    email: data.email_template
  }
}
