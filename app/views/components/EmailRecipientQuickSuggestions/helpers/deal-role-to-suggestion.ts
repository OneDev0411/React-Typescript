import { getLegalFullName } from 'deals/utils/roles/index'

import { QuickSuggestion } from '../../EmailRecipientsChipsInput/types'

export function dealRoleToSuggestion(
  dealRole: IDealRole,
  dealRolesByName: Record<string, IDealRoleDefinition>
): QuickSuggestion {
  return {
    recipient: {
      recipient_type: 'Email',
      email: dealRole.email
    },
    text: `${getLegalFullName(dealRole)} (${
      dealRolesByName[dealRole.role]?.title ?? '...'
    })`
  }
}
