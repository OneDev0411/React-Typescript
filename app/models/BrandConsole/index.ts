import Members from './Members'
import Roles from './Roles'
import Tasks from './Tasks'
import Brands from './Brands'

const BrandConsole = {
  ...Members,
  ...Roles,
  ...Tasks,
  ...Brands
}

export default BrandConsole

export const BrandTypes: { [key: string]: IBrandType } = {
  Brokerage: 'Brokerage',
  Region: 'Region',
  Office: 'Office',
  Team: 'Team',
  Personal: 'Personal',
  Other: 'Other'
}

export type IAddEditTeamFormData = Omit<IBrandInput, 'parent'>
