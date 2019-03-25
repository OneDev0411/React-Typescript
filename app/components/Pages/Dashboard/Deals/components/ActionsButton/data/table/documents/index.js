import _ from 'underscore'

import { normalizeConditions } from '../../normalize-conditions'

import {
  EDIT_BUTTON,
  DOCUSIGN_BUTTON,
  VOID_BUTTON,
  RESEND_BUTTON,
  MOVE_BUTTON,
  VIEW_BUTTON,
  TASK_NOTIFICATION_BUTTON,
  DELETE_FILE_BUTTON,
  REVIEW_ENVELOPE_BUTTON,
  SPLIT_PDF_BUTTON
} from '../../action-buttons'

import {
  DOC_FORM,
  DOC_PDF,
  DOC_GENERIC,
  ENVELOPE_NONE,
  ENVELOPE_CREATED,
  ENVELOPE_DELIVERED,
  ENVELOPE_DECLINED,
  ENVELOPE_VOIDED,
  ENVELOPE_COMPLETED
} from '../constants'

function evaluateCondition(data, conditions) {
  return _.every(conditions, (value, field) =>
    Array.isArray(value) ? value.includes(data[field]) : data[field] === value
  )
}

export default normalizeConditions([
  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: true,
        document_type: DOC_FORM,
        file_uploaded: false,
        form_saved: false,
        envelope_status: ENVELOPE_NONE
      }),
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      [DOCUSIGN_BUTTON]: {
        disabled: true
      }
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: true,
        document_type: DOC_FORM,
        file_uploaded: false,
        form_saved: true,
        envelope_status: ENVELOPE_NONE
      }),
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: true,
        document_type: DOC_FORM,
        file_uploaded: false,
        form_saved: true,
        envelope_status: ENVELOPE_CREATED
      }),
    actions: {
      [REVIEW_ENVELOPE_BUTTON]: {
        primary: true
      },
      [TASK_NOTIFICATION_BUTTON]: {},
      [VOID_BUTTON]: {},
      [VIEW_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: true,
        document_type: DOC_FORM,
        file_uploaded: false,
        form_saved: true,
        envelope_status: ENVELOPE_DELIVERED
      }),
    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [EDIT_BUTTON]: {
        disabled: true
      },
      [DOCUSIGN_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [VOID_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: true,
        document_type: DOC_FORM,
        file_uploaded: false,
        form_saved: true,
        envelope_status: [].concat(ENVELOPE_DECLINED, ENVELOPE_VOIDED)
      }),
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      [DOCUSIGN_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: true,
        document_type: DOC_FORM,
        file_uploaded: false,
        form_saved: true,
        envelope_status: ENVELOPE_COMPLETED
      }),
    actions: {
      [VIEW_BUTTON]: {
        primary: true
      },
      [DOCUSIGN_BUTTON]: {},
      [EDIT_BUTTON]: {}
    }
  },

  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: true,
        document_type: DOC_PDF,
        file_uploaded: true,
        form_saved: false,
        envelope_status: ENVELOPE_NONE
      }),
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      [VIEW_BUTTON]: {},
      [SPLIT_PDF_BUTTON]: {},
      [MOVE_BUTTON]: {},
      [DELETE_FILE_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: true,
        document_type: DOC_PDF,
        file_uploaded: true,
        form_saved: false,
        envelope_status: ENVELOPE_CREATED
      }),
    actions: {
      [REVIEW_ENVELOPE_BUTTON]: {
        primary: true
      },
      [VIEW_BUTTON]: {},
      [VOID_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [DELETE_FILE_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: true,
        document_type: DOC_PDF,
        file_uploaded: true,
        form_saved: false,
        envelope_status: ENVELOPE_DELIVERED
      }),
    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [DOCUSIGN_BUTTON]: {
        disabled: true
      },
      [VIEW_BUTTON]: {},
      [VOID_BUTTON]: {},
      [DELETE_FILE_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: true,
        document_type: DOC_PDF,
        file_uploaded: true,
        form_saved: false,
        envelope_status: [].concat(ENVELOPE_DECLINED, ENVELOPE_VOIDED)
      }),
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      [VIEW_BUTTON]: {},
      [MOVE_BUTTON]: {},
      [SPLIT_PDF_BUTTON]: {},
      [DELETE_FILE_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: true,
        document_type: DOC_PDF,
        file_uploaded: true,
        form_saved: false,
        envelope_status: ENVELOPE_COMPLETED
      }),
    actions: {
      [VIEW_BUTTON]: {
        primary: true
      },
      [DOCUSIGN_BUTTON]: {},
      [DELETE_FILE_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: true,
        document_type: DOC_GENERIC,
        file_uploaded: true,
        form_saved: false,
        envelope_status: ENVELOPE_NONE
      }),
    actions: {
      [VIEW_BUTTON]: {
        primary: true
      },
      [MOVE_BUTTON]: {},
      [DELETE_FILE_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: false,
        document_type: DOC_PDF,
        file_uploaded: true,
        form_saved: false
      }),
    actions: {
      [SPLIT_PDF_BUTTON]: {
        primary: true
      },
      [VIEW_BUTTON]: {},
      [MOVE_BUTTON]: {},
      [DELETE_FILE_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        has_task: false,
        document_type: DOC_GENERIC,
        file_uploaded: true,
        form_saved: false
      }),
    actions: {
      [MOVE_BUTTON]: {
        primary: true
      },
      [VIEW_BUTTON]: {},
      [DELETE_FILE_BUTTON]: {}
    }
  }
])
