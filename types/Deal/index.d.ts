declare interface IDeal extends IModel<'deal'> {
  id: UUID
  brand: {
    id: UUID
  }
  deal_type: 'Selling' | 'Buying'
  checklists: any[]
  tasks: IDealTask[]
  roles: IDealRole[]
  listing: UUID
}

declare interface IDealForm {}

declare type IDealTaskType = 'Form' | 'GeneralComments' | 'Generic'

declare interface IDealTask {
  id: UUID
  required: boolean
  checklist: UUID
  form: null | IDealForm
  order: number
  task_type: IDealTaskType
  title: string
}

declare interface IDealRole {
  agent: IAgent
  agent_brokerwolf_id: string
  brokerwolf_contact_type: string
  brokerwolf_id: string
  brokerwolf_row_version: string
  checklist: unknown
  commission_dollar: number
  commission_percentage: number
  company_title: string
  created_at: number
  created_by: UUID
  deal: UUID
  deleted_at: number | null
  email: string
  id: UUID
  legal_first_name: string
  legal_full_name: string
  legal_last_name: string
  legal_middle_name: string
  legal_prefix: string
  mlsid: string
  phone_number: string
  role: string
  role_type: string
  type: string
  office_phone: string
  office_email: string
  office_fax: string
  office_license_number: string
  office_mls_id: string
  office_name: string
  office_address: string
  updated_at: number
  user: IUser
}
