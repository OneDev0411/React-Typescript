declare interface IBrandForm extends IModel<'form'> {
  brand: UUID
  library: UUID
  name: string
  tab_name: Nullable<string>
}
