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

export type ShowingRoleFormValues = Pick<
  IShowingRole,
  | 'role'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone_number'
  | 'confirm_notification_type'
  | 'cancel_notification_type'
  | 'user'
  | 'brand'
>
