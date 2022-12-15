import { createContext } from 'react'

import type { EmailCampaignStatus, SortableColumnsType } from '../types'

export interface InsightsContext {
  sortOptions: SortableColumnsType[]
  sortBy: SortableColumnsType
  status: EmailCampaignStatus
}

export const Context = createContext<InsightsContext | undefined>(undefined)
