declare interface IChatMessage {
  acked_by: UUID | null
  attachments: IFile[]
  author: IUser
  comment: string | null
  created_at: number
  deleted_at: number | null
  deliveries: IChatMessageDelivery[] | null
  document_url: string | null
  id: UUID
  image_thumbnail_url: string | null
  image_url: string | null
  mentions: unknown | null
  mid: UUID
  notification: unknown | null
  recommendation: unknown | null
  reference: unknown | null
  room: string
  type: 'message'
  updated_at: string
  video_url: string | null
}

declare interface IChatActivity extends IChatMessage {
  activity: UUID
}

declare interface IChatMessageDelivery {
  user: UUID
  delivery_type: string // 'sms' | 'email' | '?' ...
  type: 'notification_delivery'
  created_at: string
}
