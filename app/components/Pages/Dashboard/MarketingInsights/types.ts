export type SortingValue = 'created_at' | '-created_at'

export interface SortableColumnsType {
  label: string
  value: SortingValue
}

export interface PageTabStats {
  executed: number
  scheduled: number
}

export type EmailCampaignStatus = 'any' | 'draft' | 'scheduled' | 'executed'
