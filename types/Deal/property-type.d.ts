declare type IDealPropertyTypes =
  | 'Resale'
  | 'New Home'
  | 'Lot / Land'
  | 'Residential Lease'
  | 'Commercial Sale'
  | 'Commercial Lease'
  | 'Active Offer'

declare interface IDealPropertyType extends IModel<'brand_property_type'> {
  brand: UUID
  checklists: Nullable<IDealChecklist[]>
  is_lease: boolean
  label: IDealPropertyTypes
}
