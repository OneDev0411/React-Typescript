export interface NormalizedBrand {
  id?: UUID
  name?: string
  subtitle?: string
  users: IUser[]
}

export type BrandedUser = IUser & {
  brand_id?: Nullable<UUID>
}

export interface Agent {
  agent: BrandedUser
  contacts: IContact[]
}
