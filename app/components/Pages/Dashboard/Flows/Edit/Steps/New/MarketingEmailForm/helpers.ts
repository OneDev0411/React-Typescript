import { MarketingEmailFormData } from '../types'

export const getInitialTemplateValue = (
  step: IBrandFlowStep
): MarketingEmailFormData['template'] => {
  if (step.template_instance) {
    return step.template_instance
  }

  return null
}
