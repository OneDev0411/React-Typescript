import _ from 'underscore'

import { normalizeConditions } from '../../normalize-conditions'

import {
  EDIT_BUTTON,
  DOCUSIGN_BUTTON,
  VOID_BUTTON,
  RESEND_BUTTON,
  VIEW_BUTTON,
  TASK_NOTIFICATION_BUTTON,
  REVIEW_ENVELOPE_BUTTON,
  SPLIT_PDF_BUTTON,
  UPLOAD_BUTTON,
  DELETE_TASK_BUTTON,
  SHOW_COMMENTS_BUTTON,
  APPROVE_TASK_BUTTON,
  DECLINE_TASK_BUTTON
} from '../../action-buttons'

import {
  TASK_GENERIC,
  TASK_FORM,
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

const sharedActions = {
  [APPROVE_TASK_BUTTON]: {},
  [DECLINE_TASK_BUTTON]: {},
  [SHOW_COMMENTS_BUTTON]: {},
  [DELETE_TASK_BUTTON]: {}
}

export default normalizeConditions([
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_GENERIC,
        file_uploaded: false,
        form_saved: false,
        envelope_status: ENVELOPE_NONE
      }),
    actions: {
      [UPLOAD_BUTTON]: {
        primary: true
      },
      ...sharedActions
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_GENERIC,
        file_uploaded: true,
        form_saved: false,
        envelope_status: ENVELOPE_NONE
      }),
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [UPLOAD_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [SPLIT_PDF_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_GENERIC,
        file_uploaded: true,
        form_saved: false,
        envelope_status: ENVELOPE_CREATED
      }),
    actions: {
      [REVIEW_ENVELOPE_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [TASK_NOTIFICATION_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_GENERIC,
        file_uploaded: true,
        form_saved: false,
        envelope_status: ENVELOPE_DELIVERED
      }),
    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [VOID_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_GENERIC,
        file_uploaded: true,
        form_saved: false,
        envelope_status: [].concat(ENVELOPE_DECLINED, ENVELOPE_VOIDED)
      }),
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [TASK_NOTIFICATION_BUTTON]: {},
      [VIEW_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [SPLIT_PDF_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_GENERIC,
        file_uploaded: true,
        form_saved: false,
        envelope_status: ENVELOPE_COMPLETED
      }),
    actions: {
      [VIEW_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [SPLIT_PDF_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: false,
        form_saved: false,
        envelope_status: ENVELOPE_NONE
      }),
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: false,
        form_saved: true,
        envelope_status: ENVELOPE_NONE
      }),
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: false,
        form_saved: true,
        envelope_status: ENVELOPE_CREATED
      }),
    actions: {
      [REVIEW_ENVELOPE_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {},
      [VIEW_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
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
      ...sharedActions,
      [VIEW_BUTTON]: {},
      [VOID_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: false,
        form_saved: true,
        envelope_status: [].concat(ENVELOPE_DECLINED, ENVELOPE_VOIDED)
      }),
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: false,
        form_saved: true,
        envelope_status: ENVELOPE_COMPLETED
      }),
    actions: {
      [VIEW_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [EDIT_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: true,
        form_saved: false,
        envelope_status: ENVELOPE_NONE
      }),
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: true,
        form_saved: false,
        envelope_status: ENVELOPE_CREATED
      }),
    actions: {
      [REVIEW_ENVELOPE_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [VIEW_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: true,
        form_saved: false,
        envelope_status: ENVELOPE_DELIVERED
      }),
    actions: {
      [RESEND_BUTTON]: {
        primary: true
      },
      [EDIT_BUTTON]: {
        disabled: true
      },
      ...sharedActions,
      [VIEW_BUTTON]: {},
      [VOID_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: true,
        form_saved: false,
        envelope_status: [].concat(ENVELOPE_DECLINED, ENVELOPE_VOIDED)
      }),
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: true,
        form_saved: false,
        envelope_status: ENVELOPE_COMPLETED
      }),
    actions: {
      [TASK_NOTIFICATION_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: true,
        form_saved: true,
        envelope_status: ENVELOPE_NONE
      }),
    actions: {
      [DOCUSIGN_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [VIEW_BUTTON]: {},
      [EDIT_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: true,
        form_saved: true,
        envelope_status: ENVELOPE_CREATED
      }),
    actions: {
      [REVIEW_ENVELOPE_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [VIEW_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: true,
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
      ...sharedActions,
      [VIEW_BUTTON]: {},
      [VOID_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: true,
        form_saved: true,
        envelope_status: [].concat(ENVELOPE_DECLINED, ENVELOPE_VOIDED)
      }),
    actions: {
      [EDIT_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [VIEW_BUTTON]: {},
      [DOCUSIGN_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  },
  {
    conditions: data =>
      evaluateCondition(data, {
        task_type: TASK_FORM,
        file_uploaded: true,
        form_saved: true,
        envelope_status: ENVELOPE_COMPLETED
      }),
    actions: {
      [VIEW_BUTTON]: {
        primary: true
      },
      ...sharedActions,
      [EDIT_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {},
      [UPLOAD_BUTTON]: {}
    }
  }
])
