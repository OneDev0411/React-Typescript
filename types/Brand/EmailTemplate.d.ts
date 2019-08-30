declare interface IBrandEmailTemplate extends IModel<'brand_email'> {
  brand: UUID
  name: string
  goal: string
  subject: string
  include_signature: boolean
  body: string
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
