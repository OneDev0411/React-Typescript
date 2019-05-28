export enum IBrandType {
  Other = 'Other' // TODO: other values
}

export interface IBrandMessage {
  branch_title: string
  listing_url: string
  office_title: string
  site_title: string
  type: string
}

export interface TeamRoleUser {
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
  users?: TeamRoleUser[] // TODO
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

// export type WithAssociations<T, K extends keyof T> = Required<Pick<T, K>>
