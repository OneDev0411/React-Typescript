export interface NormalizedBrand {
  id?: UUID
  name?: string
  subtitle?: string
  users: IUser[]
}

export interface Agent {
  agent: BrandedUser
  contacts: IContact[]
}
