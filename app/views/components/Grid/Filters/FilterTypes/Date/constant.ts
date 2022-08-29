export const operators: IFilterOperator[] = [
  {
    name: 'after',
    default: true,
    operator: 'gte'
  },
  {
    name: 'on',
    operator: 'eq'
  },
  {
    name: 'before',
    operator: 'lte'
  },
  {
    name: 'is unknown',
    operator: 'any'
  },
  {
    name: 'has any value',
    operator: 'all'
  }
]
