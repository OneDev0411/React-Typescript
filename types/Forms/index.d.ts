declare interface IFormAnnotation {
  additional: {
    calculate: {
      JS?: string
    }
  }
  borderStyle: {
    width: number
    style: number
    dashArray: number
    horizontalCornerRadius: number
    verticalCornerRadius: number
  }
  id: string
  alternativeText: string
  annotationFlags: number
  annotationType: number
  color: string
  comb: boolean
  contents: number
  defaultAppearance: number
  fieldFlags: number
  fieldName: string
  fieldType: number
  fieldValue: number
  hasAppearance: boolean
  maxLen: Nullable<number>
  modificationDate: Nullable<number>
  multiLine: boolean
  page: number
  readOnly: boolean
  rect: [number, number, number, number]
  textAlignment: Nullable<string>
  subtype: string
}

declare interface IFormTemplateValue extends IModel<'form_template'> {
  brand: UUID
  created_by: string
  field: string
  form: UUID
  value: string
}
