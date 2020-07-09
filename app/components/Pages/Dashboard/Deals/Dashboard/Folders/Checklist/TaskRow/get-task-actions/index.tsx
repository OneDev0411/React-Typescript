import {
  EMAIL_ENVELOPE,
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
  DELETE_TASK
} from '../../../../../components/ActionsButton/data/action-buttons'

interface Props {
  envelope: IDealEnvelope
  task: IDealTask
  file?: IFile
  isBackOffice: boolean
}

export function getTaskActions({
  envelope,
  task,
  file,
  isBackOffice
}: Props): ActionButtonId[] {
  const actions: ActionButtonId[] = []

  const isVoidable =
    envelope && ['Created', 'Delivered', 'Sent'].includes(envelope.status)
  const isDraft = envelope && ['Created'].includes(envelope.status)

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
  file &&
    !actions.includes(VIEW_ENVELOPE) &&
    !actions.includes(VIEW_FORM) &&
    actions.push(VIEW_FILE)
  actions.push(UPLOAD)

  actions.push(SHOW_COMMENTS)
  !isBackOffice && actions.push(TASK_NOTIFICATION)
  isBackOffice && actions.push(APPROVE_TASK)
  isBackOffice && actions.push(DECLINE_TASK)
  isBackOffice && actions.push(REQUIRE_TASK)

  actions.push(DELETE_TASK)

  return actions
}
