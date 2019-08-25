interface TaskAssociations {
  id: string
  association_type: 'contact' | 'deal' | 'listing'
  brand: string
  contact?: IContact
  deal?: IDeal
  listing?: any
  created_at: string
  created_by: string
  crm_task: string
  deleted_at: string | null
  index: number | null
  metadata: any
  type: string
  updated_at: number
}

declare interface IEvent {
  id: UUID
  associations: TaskAssociations
  due_date: number
  created_at: number
  task_type: string
  type: string
  contact: IContact
}
