import { DateOperator } from './types'

export const operators: DateOperator[] = [
  {
    name: 'exactly',
    type: 'relative',
    default: true,
    operator: 'eq'
  },
  {
    name: 'more than',
    type: 'relative',
    operator: 'gte'
  },
  {
    name: 'less than',
    type: 'relative',
    operator: 'lte'
  },
  {
    name: 'after',
    type: 'absolute',
    operator: 'gte'
  },
  {
    name: 'on',
    type: 'absolute',
    operator: 'eq'
  },
  {
    name: 'before',
    type: 'absolute',
    operator: 'lte'
  },
  {
    name: 'is unknown',
    type: 'absolute',
    operator: 'any'
  },
  {
    name: 'has any value',
    type: 'absolute',
    operator: 'all'
  }
]
