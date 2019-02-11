import { normalizeConditions } from '../../normalize-conditions'

import {
  EDIT_BUTTON,
  SHOW_COMMENTS_BUTTON,
  DOCUSIGN_BUTTON,
  VOID_BUTTON,
  RESEND_BUTTON,
  MOVE_BUTTON,
  VIEW_BUTTON,
  TASK_NOTIFICATION_BUTTON,
  UPLOAD_BUTTON,
  DELETE_FILE_BUTTON,
  DOWNLOAD_BUTTON,
  REVIEW_ENVELOPE_BUTTON,
  SPLIT_PDF_BUTTON
} from '../../action-buttons'

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
      }
      // [EMAIL_BUTTON]: {}
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
      // [EMAIL_BUTTON]: {},
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
      [TASK_NOTIFICATION_BUTTON]: {},
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
      // [EMAIL_BUTTON]: {},
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
      // [EMAIL_BUTTON]: {},
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
      // [EMAIL_BUTTON]: {},
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
      // [EMAIL_BUTTON]: {},
      [SPLIT_PDF_BUTTON]: {},
      // [RENAME_BUTTON]: {},
      [DELETE_FILE_BUTTON]: {},
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
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      // [EMAIL_BUTTON]: {},
      // [RENAME_BUTTON]: {},
      [DELETE_FILE_BUTTON]: {},
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
      // [EMAIL_BUTTON]: {},
      // [RENAME_BUTTON]: {},
      [DELETE_FILE_BUTTON]: {},
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
      // [EMAIL_BUTTON]: {},
      // [RENAME_BUTTON]: {},
      [DELETE_FILE_BUTTON]: {}
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
      [DELETE_FILE_BUTTON]: {},
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
      [DELETE_FILE_BUTTON]: {}
      // [RENAME_BUTTON]: {},
      // [EMAIL_BUTTON]: {}
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
      [DELETE_FILE_BUTTON]: {}
      // [RENAME_BUTTON]: {},
      // [EMAIL_BUTTON]: {}
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
      [SHOW_COMMENTS_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {}
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
      [SHOW_COMMENTS_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [VIEW_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [VOID_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VOID_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [VOID_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [VOID_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [VOID_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [VOID_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
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
      [SHOW_COMMENTS_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      // [EMAIL_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  }
])
