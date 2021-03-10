export interface NormalizedBrand {
  id?: UUID
  name?: string
  subtitle?: string
  users: IUser[]
}

export type BrandedUser = IUser & {
  brand_id?: UUID | null
}

export interface Agent {
  agent: BrandedUser
  contacts: IContact[]
}
