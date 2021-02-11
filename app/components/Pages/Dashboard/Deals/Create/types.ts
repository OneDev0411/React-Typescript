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

export type IDealFormRole = IDealRole & {
  id: number | string
  brand?: UUID | null
  agent: Nullable<IAgent>
  contact?: IContact
  current_address: Address | string | null
}

export type IDealType = 'Selling' | 'Buying' | 'Both'
