declare interface IBrandEmailTemplate extends IModel {
  brand: UUID
  name: string
  goal: string
  subject: string
  include_signature: boolean
  body: string
  type: 'brand_email'
  text: string
  editable: boolean
}

declare interface IBrandEmailTemplateInput {
  name: string
  goal: string
  subject: string
  include_signature: boolean
  body: string
}