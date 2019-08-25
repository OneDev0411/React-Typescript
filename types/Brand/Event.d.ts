declare interface IBrandEvent extends IModel {
  brand: UUID
  title: string
  description?: string
  task_type: TTaskType
  reminder?: number
  type: 'brand_event'
}

declare interface IBrandEventInput {
  title: string
  description?: string
  task_type: TTaskType
}
