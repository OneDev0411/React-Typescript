import Members from './Members'
import Roles from './Roles'
import Checklists from './Checklists'

const BrandConsole = {
  ...Members,
  ...Roles,
  ...Checklists
}

export default BrandConsole
