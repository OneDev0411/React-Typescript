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

export type IDealType = 'Selling' | 'Buying' | 'Both'
