export type ShowingDetailSettingsTabType =
  | 'ListingInfo'
  | 'AppointmentTypeAndParticipants'
  | 'AccessInformation'
  | 'AppraisalsAndInspections'
  | 'Availability'
  | 'Feedback'

export type ShowingDetailTabSettingsErrors = Partial<
  Record<ShowingDetailSettingsTabType, string>
>
