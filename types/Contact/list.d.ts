declare interface IContactListInput {
  name: string
  filters: IContactAttributeFilter[]
  query?: string
  args?: Pick<IContactFilterOptions, 'filter_type'>
  is_editable?: boolean
  touch_freq?: number
}

type IContactListArgs = Pick<
  IContactFilterOptions,
  'filter_type' | 'crm_tasks' | 'flows' | 'q' | 'type'
>

declare interface IContactList {
  id: UUID
  deleted_at?: number

  name: string
  filters?: IContactAttributeFilter[]
  query?: string
  args: IContactListArgs
  is_editable: boolean
  touch_freq?: number
  flows: any[] | null // fixme: update types when IFlow added
  crm_tasks: any[] | null // fixme: update types when ICrmTask added

  member_count: number

  created_by: UUID
  brand: UUID
}

declare interface IContactListMember {
  list: UUID
  contact: UUID
  is_manual: boolean

  deleted_at?: number
}
