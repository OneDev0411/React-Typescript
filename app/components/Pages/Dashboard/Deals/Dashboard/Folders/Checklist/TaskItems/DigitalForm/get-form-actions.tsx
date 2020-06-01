import {
  EDIT_FORM,
  DOCUSIGN_FORM,
  VIEW_FORM
} from '../../../../../components/ActionsButton/data/action-buttons'

export default function getFormActions(task): ActionButtonId[] {
  return [EDIT_FORM, DOCUSIGN_FORM, VIEW_FORM]
}
