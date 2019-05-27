export enum BrandType {
  Other = 'Other' // TODO: other values
}

export interface BrandMessage {
  branch_title: string
  listing_url: string
  office_title: string
  site_title: string
  type: string
}

export interface TeamRole {
  acl: string[]
  brand: string
  created_at: number
  deleted_at: number | null
  id: UUID
  members?: any[] // TODO
  role: string
  type: string
  updated_at: number
}

export interface Team {
  assets: any | null
  base_url: string
  brand_type: BrandType
  created_at: number
  children: Team[]
  deleted_at: number | null
  hostnames: string[]
  id: UUID
  member_count: number
  messages: BrandMessage
  name: string
  offices: string[]
  palette: { primary: string; type: string }
  parent: Team | null
  roles?: TeamRole
  training: boolean
  type: string // TODO: enum
  updated_at: number
}

// export type WithAssociations<T, K extends keyof T> = Required<Pick<T, K>>
