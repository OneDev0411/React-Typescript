export type FilterCriteria = {
  searchTerm: string
  filters: IContactFilter[]
  flows: UUID[]
  crmTasks: UUID[]
  conditionOperator: TContactFilterType
  sortOrder: string
}
