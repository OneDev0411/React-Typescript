// TODO: move it to types folder when types moved under app or webpack problem
// is solved anyhow
export interface IBrandMessage {
  branch_title: string
  listing_url: string
  office_title: string
  site_title: string
  type: string
}

export interface ITeamRoleUser {
  deleted_at: string
  id: UUID
  role: UUID
  type: 'brand_user' // is it fixed?
  user: IUser
}
export interface ITeamRole {
  acl: string[]
  brand: string
  created_at: number
  deleted_at: number | null
  id: UUID
  users?: ITeamRoleUser[] // TODO
  role: string
  type: string
  updated_at: number
}

export interface ITeam {
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
  type: string // TODO: enum
  updated_at: number
}

export const BrandTypes = {
  Team: 'Team',
  Brokerage: 'Brokerage',
  Office: 'Office',
  Personal: 'Personal',
  Other: 'Other'
}
export type IBrandType = typeof BrandTypes[keyof typeof BrandTypes]

// export type WithAssociations<T, K extends keyof T> = Required<Pick<T, K>>
export type ICreateBrand = Pick<ITeam, 'name' | 'brand_type'>
