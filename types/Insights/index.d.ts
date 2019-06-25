declare interface IInsight {
  id: string
  created_at: number
  updated_at: number | null
  deleted_at: number | null
  created_by: string
  brand: string
  subject: string
  include_signature: boolean
  html: string
  due_at: number
  executed_at: number
  from: From
  individual: boolean
  accepted: number
  rejected: number
  delivered: number
  failed: number
  opened: number
  clicked: number
  unsubscribed: number
  complained: number
  stored: number
  text: string
  type: string
  sent: number
  attachments: null
  emails: IInsightEmail[]
}

declare interface IInsightEmail {
  id: string
  campaign: string
  email: string
  contact: string
  recipient_type: string
  accepted: number
  rejected: number
  delivered: number
  failed: number
  opened: number
  clicked: number
  unsubscribed: number
  complained: number
  stored: number
  email_address: string
  type: string
  display_name: string
  profile_image_url: string | null
}

interface From {
  type: string
  username: string | null
  first_name: string | null
  last_name: string | null
  email: string
  phone_number: string
  created_at: number
  id: string
  address_id: string | null
  cover_image_url: string | null
  profile_image_url: string
  updated_at: number
  user_status: string
  profile_image_thumbnail_url: string | null
  cover_image_thumbnail_url: string | null
  email_confirmed: boolean
  timezone: string
  user_type: string
  deleted_at: number | null
  phone_confirmed: boolean
  agent: null
  is_shadow: boolean
  personal_room: string
  brand: string
  fake_email: boolean
  features: any[]
  last_seen_at: number
  email_signature: null
  current_time: string
  push_allowed: boolean
  last_seen_type: string
  has_docusign: boolean
  active_brand: string
  display_name: string | null
  abbreviated_display_name: string
  online_state: string
}
