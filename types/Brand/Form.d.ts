declare interface IBrandFormLibrary extends IModel<'form_library'> {
  name: string
}

declare interface IBrandForm extends IModel<'form'> {
  brand: UUID
  library: IBrandFormLibrary
  name: string
  tab_name: Nullable<string>
}
