export type ShowingDetailSettingsTabType =
  | 'ListingInfo'
  | 'ApprovalTypeAndRoles'
  | 'Instructions'
  | 'AppraisalsAndInspections'
  | 'Availability'
  | 'Feedback'
  | 'AdvanceNotice'

export type ShowingDetailTabSettingsErrors = Nullable<
  Partial<Record<ShowingDetailSettingsTabType, string>>
>
