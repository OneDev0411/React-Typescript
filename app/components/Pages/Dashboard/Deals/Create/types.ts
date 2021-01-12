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
  primaryAgents: Record<number, IDealFormPrimaryAgent>
}

export interface IDealFormPrimaryAgent {
  id: number
  agent: Nullable<IAgent>
  contact?: IContact
  brand: Nullable<UUID>
  commission_dollar: number | null
  commission_percentage: number | null
  company_title: string
  email: string
  legal_prefix?: string
  legal_first_name?: Nullable<string>
  legal_last_name?: Nullable<string>
  legal_middle_name?: string
  phone_number?: string
  role: string
  current_address: Address
  role_type: 'Person' | 'Company'
}
