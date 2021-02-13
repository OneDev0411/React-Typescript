import { MarketingEmailFormData } from '../types'

export const getInitialTemplateValue = (
  step: IBrandFlowStep
): MarketingEmailFormData['template'] => {
  if (step.template) {
    return typeof step.template === 'string'
      ? step.template
      : {
          isInstance: false,
          id: step.template.id
        }
  }

  if (step.template_instance) {
    return typeof step.template_instance === 'string'
      ? step.template_instance
      : {
          isInstance: false,
          id: step.template_instance.id
        }
  }

  return null
}
