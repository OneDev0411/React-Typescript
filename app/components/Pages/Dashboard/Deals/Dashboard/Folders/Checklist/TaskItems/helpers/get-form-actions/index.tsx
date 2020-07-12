import {
  EDIT_FORM,
  DOCUSIGN_FORM,
  EMAIL_FORM,
  VIEW_FORM
} from 'deals/components/ActionsButton/data/action-buttons'

export function getFormActions(task: IDealTask): ActionButtonId[] {
  let actions = [EDIT_FORM, DOCUSIGN_FORM, VIEW_FORM]

  task.submission && actions.push(EMAIL_FORM)

  return actions
}
