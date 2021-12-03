declare type IDealPropertyTypes =
  | 'Resale'
  | 'New Home'
  | 'Lot / Land'
  | 'Residential Lease'
  | 'Commercial Sale'
  | 'Commercial Lease'
  | 'Active Offer'

declare interface IDealRoleDefinition extends IModel<'deal_role_definition'> {
  checklist_types: IDealChecklistType[]
  role: IDealRoleType
  title: string
  transaction_type: ('Sale' | 'Lease')[]
}
declare interface IDealPropertyType extends IModel<'brand_property_type'> {
  brand: UUID
  checklists: Nullable<IBrandChecklist[]>
  is_lease: boolean
  label: IDealPropertyTypes
  order: number
  required_roles: IDealRoleDefinition[]
  optional_roles: IDealRoleDefinition[]
}
