import Members from './Members'
import Roles from './Roles'
import Checklists from './Checklists'
import Tasks from './Tasks'
import Brands from './Brands'

const BrandConsole = {
  ...Members,
  ...Roles,
  ...Checklists,
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

export type IAddEditTeamFormData = Omit<ITeamInput, 'parent'>
