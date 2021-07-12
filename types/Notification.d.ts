declare type TNotificationAction =
  | 'Liked'
  | 'Composed'
  | 'Edited'
  | 'Added'
  | 'Removed'
  | 'Posted'
  | 'Favorited'
  | 'Changed'
  | 'Created'
  | 'CreatedFor'
  | 'Shared'
  | 'Arrived'
  | 'Toured'
  | 'Accepted'
  | 'Declined'
  | 'Joined'
  | 'Left'
  | 'Archived'
  | 'Deleted'
  | 'Opened'
  | 'Closed'
  | 'Pinned'
  | 'Sent'
  | 'Invited'
  | 'BecameAvailable'
  | 'PriceDropped'
  | 'StatusChanged'
  | 'TourRequested'
  | 'IsDue'
  | 'Assigned'
  | 'Withdrew'
  | 'Attached'
  | 'Detached'
  | 'Available'
  | 'ReactedTo'
  | 'Reviewed'

declare type TNotificationObjectType =
  | 'Recommendation'
  | 'Listing'
  | 'Message'
  | 'Comment'
  | 'Room'
  | 'HotSheet'
  | 'Photo'
  | 'Video'
  | 'Document'
  | 'Tour'
  | 'Co-Shopper'
  | 'Price'
  | 'Status'
  | 'User'
  | 'Alert'
  | 'Invitation'
  | 'Contact'
  | 'Attachment'
  | 'OpenHouse'
  | 'Envelope'
  | 'EnvelopeRecipient'
  | 'Deal'
  | 'DealRole'
  | 'CrmTask'
  | 'Reminder'
  | 'ContactList'
  | 'DealContext'
  | 'ContactAttribute'
  | 'ShowingAppointment'

declare interface INotification extends IModel<'notification'> {
  object: UUID
  message: string
  room: UUID | null
  action: TNotificationAction
  object_class: TNotificationObjectType
  subject: UUID | null
  auxiliary_object_class: TNotificationObjectType
  auxiliary_object: UUID | null
  recommendation: any
  auxiliary_subject: UUID | null
  subject_class: TNotificationObjectType
  auxiliary_subject_class: TNotificationObjectType
  extra_subject_class: TNotificationObjectType
  extra_object_class: TNotificationObjectType
  exclude: UUID[] | null
  title: string
  data: any
  notification_type: string
  seen: boolean
  recommendations: any[] | null
  objects: any[]
  subjects: any[]
}
