import {
  EDIT_FORM,
  SHOW_COMMENTS,
  DOCUSIGN_FORM,
  DOCUSIGN_FILE,
  DOCUSIGN_ENVELOPE,
  VOID_ENVELOPE,
  RESEND_ENVELOPE,
  EMAIL_ENVELOPE,
  REVIEW_ENVELOPE,
  EMAIL_FILE,
  EMAIL_FORM,
  MOVE_FILE,
  VIEW_ENVELOPE,
  VIEW_FORM,
  VIEW_FILE,
  TASK_NOTIFICATION,
  UPLOAD,
  RENAME_FILE,
  DELETE_FILE,
  DELETE_TASK,
  REQUIRE_TASK,
  APPROVE_TASK,
  DECLINE_TASK,
  SPLIT_PDF
} from '../action-buttons'

export const actionsDefaultProperties = {
  [EDIT_FORM]: {
    label: 'Edit Form',
    type: 'edit-form'
  },
  [SHOW_COMMENTS]: {
    label: ({ isBackOffice }) =>
      isBackOffice ? 'Message Agent' : 'Message Admin',
    type: 'comments'
  },
  [DOCUSIGN_FORM]: {
    label: 'Docusign',
    type: 'docusign-form'
  },
  [DOCUSIGN_ENVELOPE]: {
    label: 'Docusign',
    type: 'docusign-envelope'
  },
  [DOCUSIGN_FILE]: {
    label: 'Docusign',
    type: 'docusign-file'
  },
  [VOID_ENVELOPE]: {
    label: 'Void',
    type: 'void-envelope'
  },
  [RESEND_ENVELOPE]: {
    label: 'Resend',
    type: 'resend-envelope'
  },
  [EMAIL_ENVELOPE]: {
    label: 'Email',
    type: 'email-envelope'
  },
  [EMAIL_FILE]: {
    label: 'Email',
    type: 'email-file'
  },
  [EMAIL_FORM]: {
    label: 'Email',
    type: 'email-form'
  },
  [UPLOAD]: {
    label: 'Upload',
    type: 'upload'
  },
  [RENAME_FILE]: {
    label: 'Rename',
    type: 'rename-file'
  },
  [VIEW_ENVELOPE]: {
    label: 'View/Print',
    type: 'view-envelope'
  },
  [VIEW_FILE]: {
    label: 'View/Print',
    type: 'view-file'
  },
  [VIEW_FORM]: {
    label: 'View/Print',
    type: 'view-form'
  },
  [DELETE_FILE]: {
    label: 'Delete',
    type: 'delete-file'
  },
  [DELETE_TASK]: {
    label: 'Delete',
    type: 'delete-task'
  },
  [MOVE_FILE]: {
    label: 'Move',
    type: 'move-file'
  },
  [REVIEW_ENVELOPE]: {
    label: 'Review in Docusign',
    type: 'review-envelope'
  },
  [SPLIT_PDF]: {
    label: 'Split PDF',
    type: 'split-pdf'
  },
  [APPROVE_TASK]: {
    label: 'Approve',
    type: 'approve-task',
    condition: ({ is_backoffice, is_task_notified }) =>
      is_backoffice && is_task_notified
  },
  [DECLINE_TASK]: {
    label: 'Decline',
    type: 'decline-task',
    condition: ({ is_backoffice, is_task_notified }) =>
      is_backoffice && is_task_notified
  },
  [TASK_NOTIFICATION]: {
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
  [REQUIRE_TASK]: {
    label: ({ task }) =>
      task.required ? 'Mark as Optional' : 'Mark as Required',
    type: 'require-task',
    condition: ({ is_backoffice }) => is_backoffice
  }
}
