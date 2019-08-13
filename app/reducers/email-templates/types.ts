import * as actionTypes from 'constants/email-templates'

export type IEmailTemplateState = {
  isFetching: boolean,
  error: string,
  templates: UuidMap<IBrandEmailTemplate>
}

export type IEmailTemplatesState = UuidMap<IEmailTemplateState>

export type EmailTemplateAction =
  | {
    type: typeof actionTypes.UPDATE_EMAIL_TEMPLATE
    brandId: UUID
    template: IBrandEmailTemplate
  }
  | {
    type: typeof actionTypes.FETCH_EMAIL_TEMPLATES_REQUEST
    brandId: UUID
  }
  | {
    type: typeof actionTypes.FETCH_EMAIL_TEMPLATES_SUCCESS
    brandId: UUID
    templates: IBrandEmailTemplate[]
  } | {
    type: typeof actionTypes.FETCH_EMAIL_TEMPLATES_FAILURE
    brandId: UUID
    errorMessage: string
  }


