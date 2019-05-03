import _ from 'underscore'

import {
  roleName,
  ROLE_NAMES
} from '../../../../../components/Pages/Dashboard/Deals/utils/roles'

function normalizeRoleOptions(args) {
  let options = _.chain([null, ...ROLE_NAMES])
    .filter(value => args.isAllowedRole(value, args.role))
    .map(value => ({
      value,
      label: value ? roleName(value) : 'Select Role'
    }))
    .value()

  if (options.length === 0 && args.role) {
    options = [
      {
        value: args.role,
        label: roleName(args.role)
      }
    ]
  }

  return options
}

export default _.memoize(normalizeRoleOptions, args => args.role)
