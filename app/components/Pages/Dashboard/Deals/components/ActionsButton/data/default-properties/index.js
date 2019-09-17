import {
  EDIT_BUTTON,
  SHOW_COMMENTS_BUTTON,
  DOCUSIGN_BUTTON,
  VOID_BUTTON,
  RESEND_BUTTON,
  EMAIL_BUTTON,
  MOVE_BUTTON,
  VIEW_BUTTON,
  TASK_NOTIFICATION_BUTTON,
  UPLOAD_BUTTON,
  RENAME_BUTTON,
  DELETE_FILE_BUTTON,
  DELETE_TASK_BUTTON,
  REVIEW_ENVELOPE_BUTTON,
  SPLIT_PDF_BUTTON,
  APPROVE_TASK_BUTTON,
  DECLINE_TASK_BUTTON,
  TASK_REQUIRED
} from '../action-buttons'

export const actionsDefaultProperties = {
  [EDIT_BUTTON]: {
    label: 'Edit Form',
    type: 'edit-form',
    tooltip:
      'You cannot edit while you have sent this out for signature. You can either void or wait for the signature to get completed.'
  },
  [SHOW_COMMENTS_BUTTON]: {
    label: ({ isBackOffice }) =>
      isBackOffice ? 'Message Agent' : 'Message Admin',
    type: 'comments'
  },
  [DOCUSIGN_BUTTON]: {
    label: 'Docusign',
    type: 'get-signature'
  },
  [VOID_BUTTON]: {
    label: 'Void',
    type: 'void-envelope'
  },
  [RESEND_BUTTON]: {
    label: 'Resend',
    type: 'resend-envelope'
  },
  [EMAIL_BUTTON]: {
    label: 'Email',
    type: 'send-email'
  },
  [UPLOAD_BUTTON]: {
    label: 'Upload',
    type: 'upload'
  },
  [RENAME_BUTTON]: {
    label: 'Rename',
    type: 'rename'
  },
  [VIEW_BUTTON]: {
    label: 'View/Print',
    type: 'view'
  },
  [DELETE_FILE_BUTTON]: {
    label: 'Delete',
    type: 'delete-file'
  },
  [DELETE_TASK_BUTTON]: {
    label: 'Delete',
    type: 'delete-task'
  },
  [MOVE_BUTTON]: {
    label: 'Move',
    type: 'move-file'
  },
  [REVIEW_ENVELOPE_BUTTON]: {
    label: 'Review in Docusign',
    type: 'review-envelope'
  },
  [SPLIT_PDF_BUTTON]: {
    label: 'Split PDF',
    type: 'split-pdf'
  },
  [APPROVE_TASK_BUTTON]: {
    label: 'Approve',
    type: 'approve-task',
    condition: ({ is_backoffice, is_task_notified }) =>
      is_backoffice && is_task_notified
  },
  [DECLINE_TASK_BUTTON]: {
    label: 'Decline',
    type: 'decline-task',
    condition: ({ is_backoffice, is_task_notified }) =>
      is_backoffice && is_task_notified
  },
  [TASK_NOTIFICATION_BUTTON]: {
    label: ({ task, isBackOffice }) => {
      if (isBackOffice && task.attention_requested) {
        return 'Cancel Needs Attention'
      }

      return task.attention_requested ? 'Cancel Notify' : 'Notify Office'
    },
    type: ({ task }) =>
      task.attention_requested ? 'remove-task-notification' : 'notify-task',
    condition: ({ is_backoffice, is_task_notified }) => {
      if (is_backoffice && !is_task_notified) {
        return false
      }

      return true
    }
  },
  [TASK_REQUIRED]: {
    label: ({ task }) =>
      task.required ? 'Mark as Optional' : 'Mark as Required',
    type: 'change-task-required',
    condition: ({ is_backoffice }) => is_backoffice
  }
}
