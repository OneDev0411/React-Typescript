declare interface IContactListInput {
  name: string
  filters: IContactAttributeFilter[]
  query?: string
  args?: Pick<IContactFilterOptions, 'filter_type'>
  is_editable?: boolean
  touch_freq?: number
}

declare interface IContactList {
  id: UUID
  deleted_at?: number

  name: string
  filters: IContactAttributeFilter[]
  query?: string
  args: Pick<IContactFilterOptions, 'filter_type'>
  is_pinned: boolean
  touch_freq?: number

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
