import {
  EMAIL_ENVELOPE,
  EMAIL_FORM,
  VOID_ENVELOPE,
  REVIEW_ENVELOPE,
  VIEW_ENVELOPE,
  EDIT_FORM,
  VIEW_FORM,
  DOCUSIGN_FORM,
  SHOW_COMMENTS,
  DOCUSIGN_FILE,
  VIEW_FILE,
  EMAIL_FILE,
  UPLOAD,
  SPLIT_PDF,
  TASK_NOTIFICATION,
  DECLINE_TASK,
  APPROVE_TASK,
  REQUIRE_TASK,
  DELETE_TASK,
  TASK_ACL,
  OPEN_APPLICATION,
  SELECT_TASK
} from '../../../../../components/ActionsButton/data/action-buttons'
import { useChecklistActionsContext } from '../../../../../contexts/actions-context/hooks'

interface Props {
  envelope: IDealEnvelope
  task: IDealTask
  file?: IFile
  isBackOffice: boolean
}

export function useTaskActions({
  envelope,
  task,
  file,
  isBackOffice
}: Props): ActionButtonId[] {
  const [state] = useChecklistActionsContext()

  const actions: ActionButtonId[] = []

  const isVoidable =
    envelope && ['Created', 'Delivered', 'Sent'].includes(envelope.status)
  const isDraft = envelope && ['Created'].includes(envelope.status)
  const isApplicationTask = task?.task_type === 'Application'

  isApplicationTask && actions.push(OPEN_APPLICATION)

  envelope && isDraft && actions.push(REVIEW_ENVELOPE)
  envelope && actions.push(VIEW_ENVELOPE)
  envelope && actions.push(EMAIL_ENVELOPE)
  envelope && isVoidable && actions.push(VOID_ENVELOPE)

  /*
   * There are 2 docusign_form's in this.
   * The reason is, we want the docusign_form to appear on top when the user has edited the form already.
   */
  task.form && task.submission && !file && actions.push(DOCUSIGN_FORM)
  task.form && actions.push(EDIT_FORM)
  task.form && !envelope && !file && actions.push(VIEW_FORM)
  task.form && !task.submission && !file && actions.push(DOCUSIGN_FORM)

  const isPdf = file && file.mime === 'application/pdf'

  isPdf &&
    !envelope &&
    !actions.includes(DOCUSIGN_FORM) &&
    actions.push(DOCUSIGN_FILE)

  isPdf && actions.push(SPLIT_PDF)

  file && !actions.includes(EMAIL_ENVELOPE) && actions.push(EMAIL_FILE)

  !actions.includes(EMAIL_ENVELOPE) &&
    !actions.includes(EMAIL_FILE) &&
    task.form &&
    actions.push(EMAIL_FORM)

  file &&
    !actions.includes(VIEW_ENVELOPE) &&
    !actions.includes(VIEW_FORM) &&
    actions.push(VIEW_FILE)

  !isApplicationTask && actions.push(UPLOAD)

  actions.push(SHOW_COMMENTS)
  !isApplicationTask && actions.push(TASK_NOTIFICATION)

  isBackOffice && !isApplicationTask && actions.push(APPROVE_TASK)
  isBackOffice && !isApplicationTask && actions.push(DECLINE_TASK)
  isBackOffice && !isApplicationTask && actions.push(REQUIRE_TASK)

  !isApplicationTask && actions.push(DELETE_TASK)

  task && isBackOffice && actions.push(TASK_ACL)

  task && state.actions.includes(SELECT_TASK) && actions.push(SELECT_TASK)

  return actions
}
