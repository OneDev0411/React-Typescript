declare type IBrandType = 'Team' | 'Brokerage' | 'Office' | 'Personal' | 'Other'
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

declare interface IBrand extends IModel<'brand'> {
  assets: any | null
  base_url: string
  brand_type: IBrandType
  hostnames: string[]
  member_count: number
  messages: IBrandMessage
  name: string
  offices: string[]
  palette: { primary: string; type: string; marketing: any }
  parent: IBrand | null
  children?: IBrand[]
  roles?: IBrandRole[]
  training: boolean
}
declare interface IBrandMessage {
  branch_title: string
  listing_url: string
  office_title: string
  site_title: string
  type: string
}

declare interface IBrandUser {
  deleted_at: string
  id: UUID
  role: UUID
  type: 'brand_user' // is it fixed?
  user: IUser
}
declare interface IBrandRole {
  acl: string[]
  brand: string
  created_at: number
  deleted_at: number | null
  id: UUID
  users?: IBrandUser[]
  role: string
  type: string
  updated_at: number
}

declare type IBrandInput = MapFieldsToUuid<
  Pick<IBrand, 'name' | 'brand_type', 'parent'>,
  'parent'
>
