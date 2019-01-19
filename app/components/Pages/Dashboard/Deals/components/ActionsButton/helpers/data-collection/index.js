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
  PDF: 'Pdf'
}

const envelopeStates = {
  NONE: 'None',
  DELIVERED: 'Delivered',
  DECLINED: 'Declined',
  VOIDED: 'Voided',
  COMPLETED: 'Completed'
}

const EDIT_BUTTON = 'edit'
const DOCUSIGN_BUTTON = 'docusign'
const VOID_BUTTON = 'void'
const RESEND_BUTTON = 'resend'
const EMAIL_BUTTON = 'email'
const VIEW_BUTTON = 'view'
const NOTIFY_ADMIN_BUTTON = 'notify-button'
const PRINT_BUTTON = 'print'
const UPLOAD_BUTTON = 'upload'
const RENAME_BUTTON = 'rename'
const DELETE_BUTTON = 'delete'
const DOWNLOAD_BUTTON = 'download'

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
    type: 'edit-form'
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
    label: 'Notify Office',
    type: 'notify-office'
  },
  [PRINT_BUTTON]: {
    label: 'Print',
    type: 'print'
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
    label: 'View',
    type: 'view'
  },
  [DELETE_BUTTON]: {
    label: 'Delete',
    type: 'delete'
  },
  [DOWNLOAD_BUTTON]: {
    label: 'Download',
    type: 'download'
  }
}

export const documentsConditions = normalizeConditions([
  {
    conditions: ({
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      document_type === documentTypes.FORM &&
      file_uploaded === false &&
      form_saved === false &&
      envelope_status === envelopeStates.NONE,

    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      [DOCUSIGN_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [PRINT_BUTTON]: {}
    }
  },
  {
    conditions: ({
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      document_type === documentTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      envelope_status === envelopeStates.NONE,

    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      [EDIT_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [PRINT_BUTTON]: {}
    }
  },
  {
    conditions: ({
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      document_type === documentTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      envelope_status === envelopeStates.DELIVERED,

    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [DOCUSIGN_BUTTON]: {
        enabled: false
      },
      [EDIT_BUTTON]: {
        enabled: false
      },
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [PRINT_BUTTON]: {}
    }
  },
  {
    conditions: ({
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
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
      [DOCUSIGN_BUTTON]: {},
      [RESEND_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [PRINT_BUTTON]: {}
    }
  },
  {
    conditions: ({
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      document_type === documentTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      envelope_status === envelopeStates.COMPLETED,

    actions: {
      // [EMAIL_BUTTON]: {
      //   primary: true
      // },
      [DOWNLOAD_BUTTON]: {
        primary: true
      },
      [EDIT_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [RESEND_BUTTON]: {},
      [PRINT_BUTTON]: {}
    }
  },
  {
    conditions: ({
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
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
      [PRINT_BUTTON]: {},
      [RENAME_BUTTON]: {}
    }
  },
  {
    conditions: ({
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      document_type === documentTypes.PDF &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.DELIVERED,
    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [DOCUSIGN_BUTTON]: {
        enabled: false
      },
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [PRINT_BUTTON]: {},
      [RENAME_BUTTON]: {}
    }
  },
  {
    conditions: ({
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      document_type === documentTypes.PDF &&
      file_uploaded === true &&
      form_saved === false &&
      [envelopeStates.DECLINED, envelopeStates.VOIDED].includes(
        envelope_status
      ),
    actions: {
      [DOCUSIGN_BUTTON]: {},
      [RESEND_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [PRINT_BUTTON]: {},
      [RENAME_BUTTON]: {}
    }
  },
  {
    conditions: ({
      document_type,
      file_uploaded,
      form_saved,
      envelope_status
    }) =>
      document_type === documentTypes.PDF &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.COMPLETED,
    actions: {
      // [EMAIL_BUTTON]: {
      //   primary: true
      // },
      [DOWNLOAD_BUTTON]: {
        primary: true
      },
      [DOCUSIGN_BUTTON]: {},
      [RESEND_BUTTON]: {},
      [PRINT_BUTTON]: {},
      [RENAME_BUTTON]: {}
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
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [PRINT_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
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
      [EMAIL_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [PRINT_BUTTON]: {},
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
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [PRINT_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === false &&
      form_saved === true &&
      envelope_status === envelopeStates.DELIVERED,
    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [EDIT_BUTTON]: {
        enabled: false,
        tooltip:
          'You cannot edit while you have sent this out for signature. You can either void or wait for the signature to get completed.'
      },
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [PRINT_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
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
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [RESEND_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [PRINT_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
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
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [RESEND_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [PRINT_BUTTON]: {},
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
      [EMAIL_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [PRINT_BUTTON]: {},
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
      [EDIT_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [PRINT_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === true &&
      form_saved === false &&
      envelope_status === envelopeStates.DELIVERED,
    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [EDIT_BUTTON]: {
        enabled: false,
        tooltip:
          'You cannot edit while you have sent this out for signature. You can either void or wait for the signature to get completed.'
      },
      [DOCUSIGN_BUTTON]: {},
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [PRINT_BUTTON]: {},
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
      [DOCUSIGN_BUTTON]: {},
      [RESEND_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [PRINT_BUTTON]: {},
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
      [DOCUSIGN_BUTTON]: {},
      [RESEND_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [PRINT_BUTTON]: {},
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
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [PRINT_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: ({ task_type, file_uploaded, form_saved, envelope_status }) =>
      task_type === taskTypes.FORM &&
      file_uploaded === true &&
      form_saved === true &&
      envelope_status === envelopeStates.DELIVERED,

    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [EDIT_BUTTON]: {
        enabled: false
      },
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [VOID_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [PRINT_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
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
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [RESEND_BUTTON]: {},
      [EMAIL_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [PRINT_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
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
      // [EMAIL_BUTTON]: {
      //   primary: true
      // },
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      // [RESEND_BUTTON]: {},
      [NOTIFY_ADMIN_BUTTON]: {},
      [PRINT_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  }
])
