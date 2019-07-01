declare interface IFilterOperator {
  name: string
  invert?: boolean
  default?: boolean
}

declare interface IActiveFilter {
  id: UUID
  isActive: boolean
  values: ILabelValue[]
  operator: IFilterOperator
}
