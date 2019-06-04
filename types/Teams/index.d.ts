declare type IBrandType = 'Team' | 'Brokerage' | 'Office' | 'Personal' | 'Other'

declare interface ITeam {
  assets: any | null
  base_url: string
  brand_type: IBrandType
  created_at: number
  children: ITeam[]
  deleted_at: number | null
  hostnames: string[]
  id: UUID
  member_count: number
  messages: IBrandMessage
  name: string
  offices: string[]
  palette: { primary: string; type: string }
  parent: ITeam | null
  roles?: ITeamRole[]
  training: boolean
  type: 'brand'
  updated_at: number
}
declare interface IBrandMessage {
  branch_title: string
  listing_url: string
  office_title: string
  site_title: string
  type: string
}

declare interface ITeamRoleUser {
  deleted_at: string
  id: UUID
  role: UUID
  type: 'brand_user' // is it fixed?
  user: IUser
}
declare interface ITeamRole {
  acl: string[]
  brand: string
  created_at: number
  deleted_at: number | null
  id: UUID
  users?: ITeamRoleUser[]
  role: string
  type: string
  updated_at: number
}

declare type ITeamInput = MapFieldsToUuid<
  Pick<ITeam, 'name' | 'brand_type', 'parent'>,
  'parent'
>
