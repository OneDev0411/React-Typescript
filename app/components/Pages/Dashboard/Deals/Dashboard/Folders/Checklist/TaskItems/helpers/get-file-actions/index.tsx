import {
  DOCUSIGN_FILE,
  EMAIL_FILE,
  RENAME_FILE,
  DELETE_FILE,
  MOVE_FILE,
  VIEW_FILE,
  SPLIT_PDF
} from 'deals/components/ActionsButton/data/action-buttons'

export function getFileActions(): ActionButtonId[] {
  return [
    VIEW_FILE,
    DOCUSIGN_FILE,
    EMAIL_FILE,
    RENAME_FILE,
    DELETE_FILE,
    MOVE_FILE,
    SPLIT_PDF
  ]
}
