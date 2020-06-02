import {
  DOCUSIGN_FILE,
  EMAIL_FILE,
  RENAME_FILE,
  DELETE_FILE,
  MOVE_FILE,
  VIEW_FILE,
  SPLIT_PDF
} from '../../../../../components/ActionsButton/data/action-buttons'

export default function getFileActions(): ActionButtonId[] {
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
