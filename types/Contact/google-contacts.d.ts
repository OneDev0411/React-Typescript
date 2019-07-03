declare interface IGoogleContactsImport {
  redirect: string
  url: string
  type: string
}

declare interface IGoogleAccount {
  brand: UUID
  contacts_last_sync_at: string
  created_at: string
  deleted_at: null | string
  display_name: string
  email: string
  first_name: string
  gid: UUID
  history_id: null | string
  id: string
  last_name: string
  last_sync_at: string
  last_sync_duration: number
  messages_total: null | number
  ord: string
  photo: string
  resource_name: string
  revoked: boolean
  sync_status: 'success' | 'pending' | null
  scope: string[]
  threads_total: null | number
  type: string
  updated_at: string
  user: UUID
}
