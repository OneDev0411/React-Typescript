declare type IOAuthAccountTypes = 'google_credential' | 'microsoft_credential'

declare interface IOAuthAccountImport {
  redirect: string
  url: string
  type: string
}

declare interface IOAuthAccountBase {
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
  photo: string | null
  profile_image_url: string | null
  resource_name: string
  revoked: boolean
  histories?: IGoogleSyncHistory[]
  sync_status: 'success' | 'pending' | null
  scope: string[]
  scope_summary: OAuthAccountScope[]
  threads_total: null | number
  type: string
  updated_at: string
  user: UUID
}

declare interface IGoogleAccount extends IOAuthAccountBase {
  type: 'google_credential'
}
declare interface IMicrosoftAccount extends IOAuthAccountBase {
  type: 'microsoft_credential'
}

declare type IOAuthAccount = IGoogleAccount | IMicrosoftAccount

declare type IGoogleScope =
  | 'contacts.readonly'
  | 'gmail.readonly'
  | 'gmail.send'

declare interface IGoogleSyncHistory {
  brand: string
  contacts_total: number
  created_at: string
  deleted_at: null | string
  glsh: UUID
  google_credential: UUID
  id: UUID
  messages_total: number
  ord: string
  status: boolean
  sync_duration: number
  synced_contacts_num: number
  synced_messages_num: number
  synced_threads_num: number
  threads_total: number
  extract_contacts_error: null | string
  type: 'google_sync_history'
  updated_at: string
  user: UUID
}

/**
 * Enum is not used because if its declared here, it doesn't find it's way
 * into the emitted js file (probably because these are declaration files)
 * and if it's defined outside, it can't be imported here because it's
 * not a module file.
 */
declare type OAuthAccountScope =
  | 'profile'
  | 'contacts.read'
  | 'mail.read'
  | 'mail.send'
  | 'mail.modify'
  | 'calendar'
