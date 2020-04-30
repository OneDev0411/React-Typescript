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
  | 'BetaFeatures'

declare interface ColorSet {
  bg?: string
  ta?: string
  tb?: string
}
declare interface IBrand extends IModel<'brand'> {
  assets: any | null
  base_url: string
  brand_type: IBrandType
  hostnames: string[] | null
  member_count: number
  messages: IBrandMessage
  settings: StringMap<any> | null
  name: string
  offices: string[]
  palette?: {
    type: 'brand_palette'
    primary?: string
    marketing?: {
      alpha?: ColorSet
      beta?: ColorSet
      theta?: ColorSet
    }
  }
  parent: IBrand | null
  children?: IBrand[]
  roles?: IBrandRole[]
  training: boolean
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
