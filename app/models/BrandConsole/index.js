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
