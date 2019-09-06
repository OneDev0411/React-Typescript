declare interface IBrandEvent {
  id: UUID
  created_at: number
  updated_at: number
  deleted_at: number | null
  created_by: UUID
  updated_by: UUID
  brand: UUID
  title: string
  description: string | null
  task_type: CRMTaskTypes
  reminder: number
  type: 'brand_event'
}
