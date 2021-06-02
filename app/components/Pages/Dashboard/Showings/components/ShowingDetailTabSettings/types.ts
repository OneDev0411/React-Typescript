export type ShowingDetailSettingsTabType =
  | 'ListingInfo'
  | 'ApprovalTypeAndRoles'
  | 'Instructions'
  | 'AppraisalsAndInspections'
  | 'Availability'
  | 'Feedback'

export type ShowingDetailTabSettingsErrors = Partial<
  Record<ShowingDetailSettingsTabType, string>
>
