declare interface IUserBase {
  first_name: string | null
  last_name: string | null
  display_name: string
  email: string
  phone_number: string | null
  is_shadow: boolean
  fake_email?: boolean
  profile_image_url: string | null
  cover_image_url: string | null
  password: string
  email_signature: string | null
}
declare interface IUserInput extends Partial<IUserBase> {
  agent?: UUID
  brand?: UUID | null
  skip_confirmation?: boolean

  user_connect?: UUID
  room_connect?: UUID
  actions?: string[]
}
declare interface IUser extends IUserBase {
  last_seen_at: number | null
  cover_image_thumbnail_url: string | null
  brand: string | null
  id: UUID

  email_confirmed: boolean
  phone_confirmed: boolean
  timezone: string

  secondary_password?: string

  active_brand?: string
  teams: IUserTeam[]

  agent?: IAgent

  user_type: 'Agent' | 'Client' | 'Admin'
}

declare type TUserLogicalType =
  | 'RegisteredUser'
  | 'EmailShadowUser'
  | 'PhoneShadowUser'
  | 'Unknown'

declare type TUserSignupActions =
  | 'create_alert'
  | 'listing_inquiry'
  | 'favorite_listing'

declare interface IUserActivationContext {
  agent?: UUID
  action?: TUserSignupActions
  alert?: UUID
  listing?: UUID
  room?: UUID
}

declare interface IUserTeam {
  id: UUID
  brand: IBrand
  acl: IPermission[]
  type: 'user_role'
  settings: StringMap<any>
  brand_settings: StringMap<any> | null
}
