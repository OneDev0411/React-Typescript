import { TYPE_COMPANY } from 'components/DealRole/constants/role-types'

export type Address = {
  city: string
  full: string
  house_num: string
  name: string
  postcode: string
  predir: string
  state: string
  suftype: string
  unit?: string
}

export interface Form {
  visibility: IDealVisibility
  side: IDealType
  propertyType: IDealPropertyType
  enderType: IDealEnderType
  primaryAgents: Record<number, IDealFormRole>
}

export type IDealFormRole = IDealRole & {
  id: number | string
  brand?: UUID | null
  agent: Nullable<IAgent>
  contact?: IContact
  current_address: Address | string | null
}
