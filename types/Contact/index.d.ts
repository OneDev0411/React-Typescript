declare interface IContactAttributeDefInput {
  name: string
  data_type: 'number' | 'text' | 'date'
  section?: string
  label: string
  required?: boolean
  singular?: boolean
  searchable?: boolean
  has_label?: boolean
  labels?: string[]
  enum_values?: string[]
}

declare interface IContactAttributeDef {
  id: UUID
  name: string | null
  label: string
  data_type: 'number' | 'text' | 'date'
  section: string
  global: boolean
  show: boolean
  editable: boolean
  singular: boolean
  searchable: boolean
  has_label: boolean
  labels: string[] | null
  enum_values: string[] | null
  user: UUID | null
  brand: UUID | null
}

type IContactAttributeWithDef = IContactAttribute & {
  attribute_def: IContactAttributeDef
}

declare interface ISubContact {
  id: UUID
  brand?: UUID
  created_at: number
  type: 'sub_contact'
  sections: Record<UUID, IContactAttributeWithDef[]>
  attributes: Record<UUID, IContactAttributeWithDef[]>
}

declare interface IContactBase {
  ios_address_book_id: string | null
  android_address_book_id: string | null
}

declare interface IContactInput extends IContactBase {
  id?: UUID
  user: UUID
  attributes: IContactAttributeInput[]
  ios_address_book_id: string | null
}

declare interface IContact extends IContactBase {
  id: UUID
  created_at: number
  updated_at: number
  deleted_at: number | null
  user: UUID | IUser // Varies depending on the associations. we need to fix it.
  // it doesn't exist when fetching a single contact. it exist on list
  // probably it's coming with some association). We need to figure it out
  brand?: UUID

  display_name: string
  profile_image_url: string | null
  last_touch: number | null
  next_touch: number | null
  phone_number?: string
  touch_freq?: number | null

  email: string | null
  emails: string[] | null

  partner_email: string | null
  partner_first_name: string | null
  partner_last_name: string | null
  partner_name: string | null

  attributes?: IContactAttribute[]
  users: IUser[]
  deals?: IDeal[]
  lists?: UUID[]
  flows?: UUID[]
  summary?: IContactSummary
  created_by?: IUser
  updated_by?: IUser
  type: string
}

declare interface INormalizedContact extends IContact {
  sub_contacts: ISubContact[]
}

declare interface IContactAttribute {
  id: UUID
  created_at: number
  updated_at: number
  deleted_at?: number | null

  created_by: UUID
  brand: UUID
  contact: UUID

  attribute_def: IContactAttributeDef
  attribute_type: string

  text: string
  number: number
  date: number

  index?: number
  label?: string
  is_primary: boolean
  is_partner: boolean
}

declare interface IContactAttributeInput {
  attribute_def?: UUID
  attribute_type?: string

  id?: UUID
  created_by?: UUID

  text?: string
  number?: number
  date?: number

  index?: number
  label?: string
  is_primary?: boolean
  is_partner?: boolean
}

declare interface IContactAttributeInputWithContact
  extends IContactAttributeInput {
  contact: UUID
}

declare interface IAddContactOptions {
  /** Return {ParentContact} object or just id */
  get?: boolean
  /** Continute on add attribute error */
  relax?: boolean
  /** Add activity record? */
  activity?: boolean
}

declare interface IContactSummary {
  id: UUID
  is_partner: boolean

  display_name: string
  abbreviated_display_name: string
  email?: string
  phone_number?: string

  birthday?: number
  company?: string
  cover_image_url?: string
  first_name?: string
  job_title?: string
  last_name?: string
  marketing_name?: string
  middle_name?: string
  nickname?: string
  profile_image_url?: string
  source?: string
  source_type?: string
  tags?: string[]
  title?: string
  type?: 'contact_summary'
}

declare type TContactFilterOperator =
  | 'eq'
  | 'lte'
  | 'gte'
  | 'between'
  | 'any'
  | 'all'

declare type TContactFilterType = 'and' | 'or'

declare interface IContactAttributeFilter {
  attribute_def?: UUID
  attribute_type?: string
  operator?: TContactFilterOperator
  value: any
  invert?: boolean
}

declare interface IContactFilterOptions {
  q?: string[]
  created_by?: UUID
  updated_by?: UUID
  updated_gte?: number
  updated_lte?: number
  last_touch_gte?: number
  last_touch_lte?: number
  next_touch_gte?: number
  next_touch_lte?: number
  created_gte?: number
  created_lte?: number
  alphabet?: string
  crm_tasks?: UUID[]
  flows?: UUID[]
  ids?: UUID[]
  excludes?: UUID[]
  list?: UUID
  lists?: UUID[]
  users?: UUID[]
  filter_type?: TContactFilterType
}

declare interface ICSVImporterMappingDef {
  label?: string
  attribute_def: UUID
  attribute_type?: string
  index?: number
  is_partner: boolean
}

declare interface ICSVImporterMapping {
  def: IContactAttributeDef
  label?: string
  index?: number
  is_partner: boolean
}

declare interface IContactDuplicateCluster {
  cluster: number
  contacts: IContact[]
  type: 'contact_duplicate'
  total: number
}

declare interface IContactDuplicateClusterInput {
  parent: UUID
  sub_contacts: UUID[]
}

declare interface IContactTag {
  id: UUID
  text: string
  created_at: number
  updated_at: number
  type: 'crm_tag'
}

type TContactAssociation =
  | 'contact_attribute.attribute_def'
  | 'contact.attributes'
  | 'contact.deals'
  | 'contact.users'
  | 'contact.summary'
  | 'contact.lists'
  | 'contact.flows'
  | 'contact.brand'
  | 'contact.user'
  | 'contact.created_by'
  | 'contact.updated_by'

type TContactAssociationMap<T extends string> = T extends 'contact.attributes'
  ? 'attributes'
  : T extends 'contact.deals'
  ? 'deals'
  : T extends 'contact.users'
  ? 'users'
  : T extends 'contact.summary'
  ? 'summary'
  : T extends 'contact.lists'
  ? 'lists'
  : T extends 'contact.flows'
  ? 'flows'
  : T extends 'contact.brand'
  ? 'brand'
  : T extends 'contact.user'
  ? 'user'
  : T extends 'contact.created_by'
  ? 'created_by'
  : T extends 'contact.updated_by'
  ? 'updated_by'
  : never

declare interface IFetchContactQuery {
  associations?: string[] // TODO: use TContactAssociation[]
  order?: string
  filter_type?: TContactFilterType
}

declare interface TGetContactFunc<A extends string> {
  (id: UUID, query: IFetchContactQuery): RequireProp<
    IContact,
    TContactAssociationMap<A>
  >
}
