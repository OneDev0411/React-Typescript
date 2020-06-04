import {
  EDIT_FORM,
  DOCUSIGN_FORM,
  VIEW_FORM
} from 'deals/components/ActionsButton/data/action-buttons'

export function getFormActions(): ActionButtonId[] {
  return [EDIT_FORM, DOCUSIGN_FORM, VIEW_FORM]
}
