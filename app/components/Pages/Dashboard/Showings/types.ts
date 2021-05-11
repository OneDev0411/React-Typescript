import type { ReactNode } from 'react'

export type ShowingDetailTabType =
  | 'Bookings'
  | 'Visitors'
  | 'Feedback'
  | 'Settings'

export type ShowingsTabType = 'Properties' | 'Bookings'

export type GooglePlace = google.maps.GeocoderResult

export interface ShowingPropertyBase<T extends string> {
  type: T
}

export interface ShowingPropertyPlace extends ShowingPropertyBase<'place'> {
  address: IStdAddr
  gallery: IMediaGallery
}

export interface ShowingPropertyListing extends ShowingPropertyBase<'listing'> {
  listing: ICompactListing
}

export interface ShowingPropertyDeal extends ShowingPropertyBase<'deal'> {
  deal: IDeal
}

export type ShowingPropertyType =
  | ShowingPropertyDeal
  | ShowingPropertyListing
  | ShowingPropertyPlace

export type AppointmentFilter = 'All' | IShowingAppointmentStatus | 'Feedback'

export interface AppointmentFilterInfo {
  label: string
  icon?: ReactNode
  filter?: (appointments: IShowingAppointment[]) => IShowingAppointment[]
}

export interface DismissActionParams {
  appointmentId: UUID
  showingId: UUID
  notificationCount: number
}
export interface ApprovalActionParams extends DismissActionParams {
  status: IShowingAppointmentStatus
}
