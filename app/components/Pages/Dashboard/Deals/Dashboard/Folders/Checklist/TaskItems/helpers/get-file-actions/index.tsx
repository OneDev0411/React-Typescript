import {
  DOCUSIGN_FILE,
  EMAIL_FILE,
  RENAME_FILE,
  DELETE_FILE,
  MOVE_FILE,
  VIEW_FILE,
  SPLIT_PDF
} from 'deals/components/ActionsButton/data/action-buttons'

const DOCUSIGNABLE_FORMATS = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/mspowerpoint',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/html',
  'application/pdf',
  'application/rtf',
  'text/plain',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/tiff'
]

export function getFileActions(file: IFile): ActionButtonId[] {
  const list = [VIEW_FILE]

  DOCUSIGNABLE_FORMATS.includes(file.mime) && list.push(DOCUSIGN_FILE)

  list.push(...[EMAIL_FILE, RENAME_FILE, DELETE_FILE, MOVE_FILE])

  file.mime === 'application/pdf' && list.push(SPLIT_PDF)

  return list
}
