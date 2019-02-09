import _ from 'underscore'

/**
 * https://docs.google.com/spreadsheets/d/1XhJQK5Fq8V4dJLx98CAchOwwZci0yWoTFBSWV1deGY0
 */

const taskTypes = {
  GENERIC: 'Generic',
  FORM: 'Form'
}

const documentTypes = {
  FORM: 'Form',
  PDF: 'Pdf',
  GENERIC: 'Generic'
}

const envelopeStates = {
  NONE: 'None',
  CREATED: 'Created',
  DELIVERED: ['Delivered', 'Sent'],
  DECLINED: 'Declined',
  VOIDED: 'Voided',
  COMPLETED: 'Completed'
}

const EDIT_BUTTON = 0
const MESSAGE_ADMIN = 1
const DOCUSIGN_BUTTON = 2
const VOID_BUTTON = 3
const RESEND_BUTTON = 4
const EMAIL_BUTTON = 5
const MOVE_BUTTON = 6
const VIEW_BUTTON = 7
const NOTIFY_ADMIN_BUTTON = 8
const UPLOAD_BUTTON = 9
const RENAME_BUTTON = 10
const DELETE_BUTTON = 11
const DOWNLOAD_BUTTON = 12
const REVIEW_ENVELOPE_BUTTON = 13
const SPLIT_PDF_BUTTON = 14

function normalizeConditions(conditions) {
  return conditions.map(item => ({
    ...item,
    actions: _.map(item.actions, (properties, id) => ({
      id,
      ...properties,
      ...actionsDefaultProperties[id]
    }))
  }))
}

const actionsDefaultProperties = {
  [EDIT_BUTTON]: {
    label: 'Edit',
    type: 'edit-form',
    tooltip:
      'You cannot edit while you have sent this out for signature. You can either void or wait for the signature to get completed.'
  },
  [MESSAGE_ADMIN]: {
    label: 'Message Admin',
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
  [NOTIFY_ADMIN_BUTTON]: {
    label: ({ task }) =>
      task.attention_requested ? 'Cancel Notify' : 'Notify Office',
    type: ({ task }) =>
      task.attention_requested ? 'cancel-notify-office' : 'notify-office'
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
  [DELETE_BUTTON]: {
    label: 'Delete',
    type: 'delete'
  },
  [DOWNLOAD_BUTTON]: {
    label: 'Download',
    type: 'download'
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
  }
}

export const documentsConditions = normalizeConditions([
  {
    conditions: ({
      has_task,
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      has_task === true &&
      document_type === documentTypes.FORM &&
      file_uploaded === false &&
      form_saved === false &&
      envelope_status === envelopeStates.NONE,

    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      [DOCUSIGN_BUTTON]: {
        disabled: true
      },
      [EMAIL_BUTTON]: {}
    }
  },
  {
    conditions: ({
      has_task,
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      has_task === true &&
      document_type === documentTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      envelope_status === envelopeStates.NONE,
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      [EDIT_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({
      has_task,
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      has_task === true &&
      document_type === documentTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      envelope_status === envelopeStates.CREATED,
    actions: {
      [REVIEW_ENVELOPE_BUTTON]: {
        primary: true
      },
      [VOID_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({
      has_task,
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      has_task === true &&
      document_type === documentTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      envelopeStates.DELIVERED.includes(envelope_status),
    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [DOCUSIGN_BUTTON]: {
        disabled: true
      },
      [EDIT_BUTTON]: {
        disabled: true
      },
      [VIEW_BUTTON]: {},
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({
      has_task,
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      has_task === true &&
      document_type === documentTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      [envelopeStates.DECLINED, envelopeStates.VOIDED].includes(
        envelope_status
      ),
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({
      has_task,
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      has_task === true &&
      document_type === documentTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      envelope_status === envelopeStates.COMPLETED,

    actions: {
      [DOWNLOAD_BUTTON]: {
        primary: true
      },
      [VIEW_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [EDIT_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {}
    }
  },
  {
    conditions: ({
      has_task,
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      has_task === true &&
      document_type === documentTypes.PDF &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.NONE,
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      [VIEW_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [SPLIT_PDF_BUTTON]: {},
      // [RENAME_BUTTON]: {},
      [DELETE_BUTTON]: {},
      [MOVE_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({
      has_task,
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      has_task === true &&
      document_type === documentTypes.PDF &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.CREATED,
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      [VIEW_BUTTON]: {},
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({
      has_task,
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      has_task === true &&
      document_type === documentTypes.PDF &&
      file_uploaded === true &&
      form_saved === false &&
      envelopeStates.DELIVERED.includes(envelope_status),
    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [DOCUSIGN_BUTTON]: {
        disabled: true
      },
      [VIEW_BUTTON]: {},
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      // [RENAME_BUTTON]: {},
      [DELETE_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({
      has_task,
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      has_task === true &&
      document_type === documentTypes.PDF &&
      file_uploaded === true &&
      form_saved === false &&
      [envelopeStates.DECLINED, envelopeStates.VOIDED].includes(
        envelope_status
      ),
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      [VIEW_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      // [RENAME_BUTTON]: {},
      [DELETE_BUTTON]: {},
      [MOVE_BUTTON]: {},
      [SPLIT_PDF_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({
      has_task,
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      has_task === true &&
      document_type === documentTypes.PDF &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.COMPLETED,
    actions: {
      [DOWNLOAD_BUTTON]: {
        primary: true
      },
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      // [RENAME_BUTTON]: {},
      [DELETE_BUTTON]: {}
    }
  },
  {
    conditions: ({
      has_task,
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      has_task === true &&
      document_type === documentTypes.GENERIC &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.NONE,
    actions: {
      [DOWNLOAD_BUTTON]: {
        primary: true
      },
      [VIEW_BUTTON]: {},
      // [RENAME_BUTTON]: {},
      [DELETE_BUTTON]: {},
      [MOVE_BUTTON]: {}
    }
  },
  {
    conditions: ({ has_task, document_type, file_uploaded, form_saved }) =>
      has_task === false &&
      document_type === documentTypes.PDF &&
      file_uploaded === true &&
      form_saved === false,
    actions: {
      [MOVE_BUTTON]: {
        primary: true
      },
      [DOWNLOAD_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [SPLIT_PDF_BUTTON]: {},
      [DELETE_BUTTON]: {},
      // [RENAME_BUTTON]: {},
      [EMAIL_BUTTON]: {}
    }
  },
  {
    conditions: ({ has_task, document_type, file_uploaded, form_saved }) =>
      has_task === false &&
      document_type === documentTypes.GENERIC &&
      file_uploaded === true &&
      form_saved === false,
    actions: {
      [MOVE_BUTTON]: {
        primary: true
      },
      [DOWNLOAD_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DELETE_BUTTON]: {},
      // [RENAME_BUTTON]: {},
      [EMAIL_BUTTON]: {}
    }
  }
])

export const tasksConditions = normalizeConditions([
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.GENERIC &&
      file_uploaded === false &&
      form_saved === false &&
      envelope_status === envelopeStates.NONE,
    actions: {
      [UPLOAD_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [NOTIFY_ADMIN_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.GENERIC &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.NONE,
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [UPLOAD_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [SPLIT_PDF_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.GENERIC &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.CREATED,
    actions: {
      [REVIEW_ENVELOPE_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [DOCUSIGN_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.GENERIC &&
      file_uploaded === true &&
      form_saved === false &&
      envelopeStates.DELIVERED.includes(envelope_status),
    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [DOCUSIGN_BUTTON]: {},
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.GENERIC &&
      file_uploaded === true &&
      form_saved === false &&
      [envelopeStates.DECLINED, envelopeStates.VOIDED].includes(
        envelope_status
      ),
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {},
      [SPLIT_PDF_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.GENERIC &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.COMPLETED,
    actions: {
      [DOWNLOAD_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [DOCUSIGN_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [SPLIT_PDF_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === false &&
      form_saved === false &&
      envelope_status === envelopeStates.NONE,
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      envelope_status === envelopeStates.NONE,
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      envelope_status === envelopeStates.CREATED,
    actions: {
      [REVIEW_ENVELOPE_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      envelopeStates.DELIVERED.includes(envelope_status),
    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [EDIT_BUTTON]: {
        disabled: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      [envelopeStates.DECLINED, envelopeStates.VOIDED].includes(
        envelope_status
      ),
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      envelope_status === envelopeStates.COMPLETED,
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.NONE,
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.NONE,
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.CREATED,
    actions: {
      [REVIEW_ENVELOPE_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === true &&
      form_saved === false &&
      envelopeStates.DELIVERED.includes(envelope_status),
    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [EDIT_BUTTON]: {
        disabled: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === true &&
      form_saved === false &&
      [envelopeStates.DECLINED, envelopeStates.VOIDED].includes(
        envelope_status
      ),
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.COMPLETED,
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === true &&
      form_saved === true &&
      envelope_status === envelopeStates.NONE,
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === true &&
      form_saved === true &&
      envelope_status === envelopeStates.CREATED,
    actions: {
      [REVIEW_ENVELOPE_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === true &&
      form_saved === true &&
      envelopeStates.DELIVERED.includes(envelope_status),
    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [EDIT_BUTTON]: {
        disabled: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === true &&
      form_saved === true &&
      [envelopeStates.DECLINED, envelopeStates.VOIDED].includes(
        envelope_status
      ),
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [DOWNLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === true &&
      form_saved === true &&
      envelope_status === envelopeStates.COMPLETED,
    actions: {
      [DOWNLOAD_BUTTON]: {
        primary: true
      },
      [MESSAGE_ADMIN]: {},
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  }
])
