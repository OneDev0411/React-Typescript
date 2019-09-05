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
  Team: 'Team',
  Brokerage: 'Brokerage',
  Office: 'Office',
  Personal: 'Personal',
  Other: 'Other'
}

export type IAddEditTeamFormData = Omit<IBrandInput, 'parent'>
