import * as actionTypes from 'constants/email-templates'

export type IEmailTemplatesState = UuidMap<IBrandEmailTemplate>

export type EmailTemplateAction =
  | {
      type: typeof actionTypes.UPDATE_EMAIL_TEMPLATE
      brandId: string
      template: IBrandEmailTemplate
    }
  | {
      type: typeof actionTypes.UPDATE_EMAIL_TEMPLATES
      brandId: string
      templates: IBrandEmailTemplate[]
    }
