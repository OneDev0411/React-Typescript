declare type LeadChannelSourceType = 'Zillow' | 'Realtor'

declare interface LeadChannel extends IModel<'lead_channel'> {
  brand: UUID
  capture_number: number
  last_capture_date: number | null
  source_type: LeadChannelSourceType
  user: UUID
}
