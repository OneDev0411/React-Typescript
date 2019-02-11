import { normalizeConditions } from '../../normalize-conditions'

import {
  VIEW_BUTTON,
  DOWNLOAD_BUTTON,
  SHOW_COMMENTS_BUTTON,
  TASK_NOTIFICATION_BUTTON,
  APPROVE_TASK_BUTTON,
  DECLINE_TASK_BUTTON,
  DELETE_TASK_BUTTON,
  DELETE_FILE_BUTTON
} from '../../action-buttons'

const documentTypes = {
  FORM: 'Form'
}

export const documentsConditions = normalizeConditions([
  {
    conditions: ({ document_type, file_uploaded }) =>
      document_type !== documentTypes.FORM && file_uploaded === true,
    actions: {
      [VIEW_BUTTON]: {
        primary: true
      },
      [DOWNLOAD_BUTTON]: {},
      [DELETE_FILE_BUTTON]: {}
    }
  },
  {
    conditions: ({ document_type, file_uploaded }) =>
      document_type === documentTypes.FORM && file_uploaded === false,
    actions: {
      [VIEW_BUTTON]: {
        primary: true
      },
      [DOWNLOAD_BUTTON]: {}
    }
  }
])

export const tasksConditions = normalizeConditions([
  {
    conditions: ({ is_task_notified }) => is_task_notified === true,
    actions: {
      [SHOW_COMMENTS_BUTTON]: {
        primary: true
      },
      [APPROVE_TASK_BUTTON]: {},
      [DECLINE_TASK_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [DELETE_TASK_BUTTON]: {}
    }
  },
  {
    conditions: ({ is_task_notified }) => is_task_notified === false,
    actions: {
      [SHOW_COMMENTS_BUTTON]: {
        primary: true
      },
      [DELETE_TASK_BUTTON]: {}
    }
  }
])
