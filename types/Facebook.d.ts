declare interface IFacebookPage extends IModel<'facebook_page'> {
  id: UUID
  facebook_credential: UUID
  name: string
  facebook_page_id: string
  instagram_business_account_id: string
  instagram_username: string
  instagram_profile_picture_url: string
  revoked: boolean
  brand: IBrand
  user: IUser
  facebook_access_token: facebook_access_token
}
