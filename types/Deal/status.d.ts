declare interface IDealStatus {
  type: 'brand_deal_status'
  id: string
  created_at: number
  updated_at: number | null
  deleted_at: number | null
  brand: string
  label: string
  color: string
  deal_types: IDealType[]
  property_types: IDealPropertyType[]
  admin_only: boolean
}
