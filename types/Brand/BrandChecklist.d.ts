declare interface IBrandChecklist extends IModel<'brand_checklist'> {
  brand: UUID
  title: string
  deal_type: 'Buying' | 'Selling'
  is_deactivatable: boolean
  is_terminatable: boolean
  order: number
  property_type: string // it's actually enum
  tab_name: string
  tasks: IDealTask[]
}
