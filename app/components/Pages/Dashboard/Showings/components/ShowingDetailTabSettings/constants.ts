import type { ShowingDetailSettingsTabType } from './types'

export const showingDetailSettingsTabs: Record<
  ShowingDetailSettingsTabType,
  string
> = {
  Availability: 'Availability',
  ListingInfo: 'Listing Info',
  ApprovalTypeAndRoles: 'Appointment Type & Participants',
  AccessInformation: 'Access Information',
  AppraisalsAndInspections: 'Appraisals & Inspections',
  Feedback: 'Feedback'
}
