declare interface IDealStatus extends IModel<'brand_deal_status'> {
  brand: string
  label: IListingStatus
  is_active: boolean
  is_pending: boolean
  is_archived: boolean
  deal_types: IDealType[]
  property_types: IDealPropertyType[]
  admin_only: boolean
}
