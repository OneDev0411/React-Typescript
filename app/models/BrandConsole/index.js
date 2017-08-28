import Members from './Members'
import Roles from './Roles'
import Checklists from './Checklists'
import Tasks from './Tasks'

const BrandConsole = {
  ...Members,
  ...Roles,
  ...Checklists,
  ...Tasks
}

export default BrandConsole
