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
    operator: 'eq'
  },
  {
    name: 'has any value',
    invert: true,
    operator: 'eq'
  }
]

export const operatorsWithNoValue: string[] = ['is unknown', 'has any value']
