export interface SortableColumnsType {
  label: string
  value: string
  ascending: boolean
}

export interface PageTabStats {
  executed: number
  scheduled: number
}

export type EmailCampaignStatus = 'any' | 'draft' | 'scheduled' | 'executed'
