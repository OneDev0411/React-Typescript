declare interface IBrandEvent extends IModel<'brand_event'> {
  brand: UUID
  title: string
  description?: string
  task_type: TTaskType
  reminder?: number
}

declare interface IBrandEventInput {
  title: string
  description?: string
  task_type: TTaskType
}
