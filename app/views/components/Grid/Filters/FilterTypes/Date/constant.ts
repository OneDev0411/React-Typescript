import { DateOperator } from './types'

export const operators: DateOperator[] = [
  {
    name: 'exactly',
    type: 'relative',
    default: true
  },
  {
    name: 'more than',
    type: 'relative'
  },
  {
    name: 'less than',
    type: 'relative'
  },
  {
    name: 'after',
    type: 'absolute'
  },
  {
    name: 'on',
    type: 'absolute'
  },
  {
    name: 'before',
    type: 'absolute'
  },
  {
    name: 'is unknown',
    type: 'absolute'
  },
  {
    name: 'has any value',
    type: 'absolute'
  }
]
