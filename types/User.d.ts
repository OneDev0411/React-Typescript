declare interface IUserBase extends IModel<'user'> {
  first_name: Nullable<string>
  last_name: Nullable<string>
  display_name: string
  email: string
  phone_number: Nullable<string>
  is_shadow: boolean
  fake_email?: boolean
  docusign?: IUserDocusign
  profile_image_url: Nullable<string>
  cover_image_url: Nullable<string>
  email_signature: Nullable<string>
  access_token: string
  refresh_token: string
  facebook: Nullable<string>
  twitter: Nullable<string>
  linkedin: Nullable<string>
  youtube: Nullable<string>
  instagram: Nullable<string>
  tiktok: Nullable<string>
}
declare interface IUserInput extends Partial<IUserBase> {
  agent?: UUID
  brand?: Nullable<UUID>
  skip_confirmation?: boolean

  user_connect?: UUID
  room_connect?: UUID
  actions?: string[]
}

declare type TUserType = 'Agent' | 'Client' | 'Admin'

declare interface IUser extends IUserBase {
  last_seen_at: Nullable<number>
  cover_image_thumbnail_url: Nullable<string>
  brand: Nullable<string>
  id: UUID

  email_confirmed: boolean
  phone_confirmed: boolean
  timezone: string

  secondary_password?: string

  active_brand: Nullable<string>

  agents: Nullable<IAgent[]>

  personal_room: Nullable<UUID>

  user_type: TUserType
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
  // API: "we supposed to do some staff in feature on this field but for now it's always null"
  subscription?: Nullable<unknown>
}

declare interface IUserDocusign extends IModel<'docusign_account'> {
  email: string
  first_name: string
  last_name: string
}

type TUserActivityActions =
  | 'UserLoggedIn'
  | 'UserLoggedOut'
  | 'UserSearchedListings'
  | 'UserViewedAlert'
  | 'UserViewedListing'
  | 'UserFavoritedListing'
  | 'UserSharedListing'
  | 'UserCreatedAlert'
  | 'UserCommentedRoom'
  | 'UserOpenedIOSApp'
  | 'UserCalledContact'
  | 'UserCreatedContact'
  | 'UserSignedUp'
  | 'UserInvited'
  | 'UserUpdatedSubmission'
  | 'UserViewedFile'
  | 'UserUpdatedReview'
  | 'UserCreatedEnvelopeForSubmission'
  | 'UserReactedToEnvelopeForSubmission'
  | 'UserSharedAlert'
  | 'UserCreatedDeal'
  | 'UserSavedAlert'
  | 'UserUploadedFile'
  | 'UserDeletedFile'
  | 'UserAddedTask'
  | 'UserNotifiedOffice'
  | 'UserRequestedDeletionOfTask'
  | 'DealRoleReactedToEnvelopeForSubmission'
  | 'UserCreatedCrmTask'
  | 'UserCreatedContactAttributeDef'
  | 'UserCreatedEnvelopeForTask'
  | 'DealRoleReactedToEnvelopeForTask'
  | 'UserImportedContacts'
  | 'UserCreatedContactList'
  | 'UserUpdatedContactList'
  | 'UserVoidedEnvelopeForTask'
  | 'UserRenamedFile'
  | 'UserRequiredTask'

declare interface IUserActivity {
  action: TUserActivityActions
  object_class: string
  object?: unknown
}

declare interface BrandedUser extends IUser {
  brand_id?: Nullable<UUID>
}
