declare type IBrandType = 'Team' | 'Brokerage' | 'Office' | 'Personal' | 'Other'

declare type IBrandRoleType = 'Admin' | 'Agent' | 'Other'

declare type IAccessControlPolicy =
  | 'ActiveTeam'
  | 'ActiveTeamAndParents'
  | 'Root'
declare type IPermission =
  | 'Deals'
  | 'BackOffice'
  | 'Admin'
  | 'Marketing'
  | 'CRM'
  | 'STORE'
  | 'BetaFeatures'
  | 'AgentNetwork'
  | 'Websites'
  | 'Showings'

declare type BrandMarketingPaletteKey =
  | 'body-bg-color'
  | 'body-text-color'
  | 'body-font-family'
  | 'body-font-size'
  | 'body-font-weight'
  | 'body-logo-wide'
  | 'body-logo-square'
  | 'container-bg-color'
  | 'container-text-color'
  | 'container-font-family'
  | 'container-font-size'
  | 'container-font-weight'
  | 'container-logo-wide'
  | 'container-logo-square'
  | 'button-bg-color'
  | 'button-text-color'
  | 'button-font-family'
  | 'button-font-size'
  | 'button-font-weight'
  | 'button-border'
  | 'light-text-color'
  | 'light-font-family'
  | 'light-font-size'
  | 'light-font-weight'
  | 'h1-text-color'
  | 'h1-font-family'
  | 'h1-font-size'
  | 'h1-font-weight'
  | 'h2-text-color'
  | 'h2-font-family'
  | 'h2-font-size'
  | 'h2-font-weight'
  | 'h3-text-color'
  | 'h3-font-family'
  | 'h3-font-size'
  | 'h3-font-weight'
  | 'inverted-button-bg-color'
  | 'inverted-button-text-color'
  | 'inverted-light-text-color'
  | 'inverted-h1-text-color'
  | 'inverted-h2-text-color'
  | 'inverted-h3-text-color'
  | 'inverted-logo-wide'
  | 'inverted-logo-square'
  | 'inverted-container-bg-color'
  | 'inverted-container-text-color'
  | 'website'
  | 'name'

declare type BrandMarketingPalette = Record<BrandMarketingPalette, string>

declare interface IBrand extends IModel<'brand'> {
  assets: any | null
  base_url: string
  brand_type: IBrandType
  hostnames: string[] | null
  member_count: number
  messages: Nullable<IBrandMessage>
  settings: Nullable<IBrandSetting>
  name: string
  offices: string[]
  parent: IBrand | null
  children?: IBrand[]
  roles?: IBrandRole[]
  training: boolean
}

declare interface IBrandTheme {
  navbar_logo: string
  palette: Palette
}

declare interface IBrandSettings extends IModel<'brand_settings'> {
  enable_open_house_requests: boolean | null
  enable_yard_sign: boolean | null
  enable_liveby: boolean | null
  marketing_palette: {
    BrandMarketingPalette
  } | null
  theme: IBrandTheme | null
}

declare interface IBrandMessage {
  type: 'brand_messages'
  branch_title?: string
  listing_url?: string
  office_title?: string
  site_title?: string
  mmm_cost_center?: string
  search_headline?: string
}

declare interface IBrandUser {
  deleted_at: string | null
  id: UUID
  role: UUID
  type: 'brand_user' // is it fixed?
  user: IUser
}
declare interface IBrandRole extends IModel<'brand_role'> {
  acl: IPermission[]
  brand: string
  users?: IBrandUser[]
  role: IBrandRoleType
}

declare type IBrandInput = MapFieldsToUuid<
  Pick<IBrand, 'name' | 'brand_type', 'parent'>,
  'parent'
>
