export interface IUserWithBrand extends IUser {
  brand_id?: UUID
}

export interface AgentItem {
  agent: IUserWithBrand
  contacts: IContact[]
}
