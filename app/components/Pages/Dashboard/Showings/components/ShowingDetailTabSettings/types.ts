export type ShowingDetailSettingsTabType =
  | 'ListingInfo'
  | 'ApprovalTypeAndRoles'
  | 'Instructions'
  | 'AppraisalsAndInspections'
  | 'Availability'
  | 'Feedback'
  | 'AdvanceNotice'

export type ShowingDetailTabSettingsErrors = Partial<
  Record<ShowingDetailSettingsTabType, string>
>
