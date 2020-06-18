import type { StateContext } from 'deals/Dashboard/Folders/actions-context'

import {
  EDIT_FORM,
  DOCUSIGN_FORM,
  VIEW_FORM
} from 'deals/components/ActionsButton/data/action-buttons'

export function getFormActions(state: StateContext): ActionButtonId[] {
  if (state.attachments.length > 0) {
    return [DOCUSIGN_FORM, EDIT_FORM, VIEW_FORM]
  }

  return [EDIT_FORM, DOCUSIGN_FORM, VIEW_FORM]
}
