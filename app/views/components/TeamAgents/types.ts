export interface IUserWithBrand extends IUser {
  brand_id?: UUID
}

export interface AgentItem {
  agent: IUserWithBrand
  contacts: IContact[]
}

export interface NormalizedBrand {
  id?: UUID
  name?: string
  subtitle?: string
  users: IUser[]
}

export type BrandedUser = IUser & {
  brand_id?: UUID | null
}
