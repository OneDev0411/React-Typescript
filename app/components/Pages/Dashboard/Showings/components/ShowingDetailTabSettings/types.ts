export type ShowingDetailSettingsTabType =
  | 'ListingInfo'
  | 'ApprovalTypeAndRoles'
  | 'AccessInformation'
  | 'AppraisalsAndInspections'
  | 'Availability'
  | 'Feedback'

export type ShowingDetailTabSettingsErrors = Partial<
  Record<ShowingDetailSettingsTabType, string>
>
