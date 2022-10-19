import { createContext } from 'react'

import { SortableColumnsType } from '../types'

export interface InsightsContext {
  sortBy: SortableColumnsType
  status: 'any' | 'draft' | 'scheduled' | 'executed'
}

export const Context = createContext<InsightsContext | undefined>(undefined)
