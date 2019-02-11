import { normalizeConditions } from '../../normalize-conditions'

import {
  SHOW_COMMENTS_BUTTON,
  TASK_NOTIFICATION_BUTTON,
  APPROVE_TASK_BUTTON,
  DECLINE_TASK_BUTTON
} from '../../action-buttons'

export const tasksConditions = normalizeConditions([
  {
    conditions: ({ is_task_notified }) => is_task_notified === true,
    actions: {
      [SHOW_COMMENTS_BUTTON]: {
        primary: true
      },
      [APPROVE_TASK_BUTTON]: {},
      [DECLINE_TASK_BUTTON]: {},
      [TASK_NOTIFICATION_BUTTON]: {}
    }
  },
  {
    conditions: ({ is_task_notified }) => is_task_notified === false,
    actions: {
      [SHOW_COMMENTS_BUTTON]: {
        primary: true
      }
    }
  }
])
