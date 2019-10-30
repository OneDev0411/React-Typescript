import { getLegalFullName, roleName } from 'deals/utils/roles'

import { QuickSuggestion } from '../types'

export function dealRoleToSuggestion(dealRole: IDealRole): QuickSuggestion {
  return {
    recipient: {
      recipient_type: 'Email',
      email: dealRole.email
    },
    text: `${getLegalFullName(dealRole)} (${roleName(dealRole.role)})`
  }
}
