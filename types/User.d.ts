declare interface IUserBase extends IModel<'user'> {
  first_name: string | null
  last_name: string | null
  display_name: string
  email: string
  phone_number: string | null
  is_shadow: boolean
  fake_email?: boolean
  docusign?: IUserDocusign
  profile_image_url: string | null
  cover_image_url: string | null
  email_signature: string | null
  access_token: string
  refresh_token: string
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

  active_brand: string | null
  teams?: IUserTeam[] // seems it comes with association

  agent: IAgent | null // association?

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
}

declare interface IUserDocusign extends IModel<'docusign_account'> {
  email: string
  first_name: string
  last_name: string
}
