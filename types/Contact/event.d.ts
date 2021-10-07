interface TaskAssociation {
  id: string
  association_type: 'contact' | 'deal' | 'listing'
  brand: string
  contact?: IContact
  deal?: IDeal
  listing?: any
  created_at: string
  created_by: string
  crm_task: string
  deleted_at: Nullable<string>
  index: Nullable<number>
  metadata: any
  type: string
  updated_at: number
}

declare interface IEvent extends IModel<'crm_task'> {
  associations: TaskAssociation[]
  assignees: IUser[]
  due_date: number
  end_date: Nullable<number>
  all_day: boolean
  task_type: string
  crm_task: UUID
  contact: IContact
  title: string
  description: string
  status: Nullable<string>
  metadata?: Pick<ICalendarEvent, 'metadata'>
}
